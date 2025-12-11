/**
 * Input validation and sanitization middleware
 * Uses Joi for schema validation and custom sanitization
 */

import Joi from 'joi';

/**
 * Normalize phone number by removing non-digits and leading zeros
 * @param {string} phone - Raw phone number
 * @returns {string} - Normalized phone number
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '').replace(/^0+/, '');
}

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - Raw input string
 * @returns {string} - Sanitized string
 */
export function sanitizeString(input) {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 500); // Limit length
}

/**
 * Sanitize email input
 * @param {string} email - Raw email
 * @returns {string} - Sanitized email
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase().substring(0, 254); // RFC 5321 limit
}

/**
 * User registration validation schema
 */
export const userRegistrationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s.'-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters, spaces, dots, hyphens and apostrophes',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    
  email: Joi.string()
    .email()
    .max(254)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
    
  phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10-15 digits'
    }),
    
  program: Joi.string()
    .valid('MBA', 'B.Tech', 'M.Tech', 'BBA', 'MCA', 'Other')
    .required()
    .messages({
      'any.only': 'Program must be one of: MBA, B.Tech, M.Tech, BBA, MCA, Other'
    }),
    
  year: Joi.number()
    .integer()
    .min(1)
    .max(4)
    .required()
    .messages({
      'number.min': 'Year must be between 1 and 4',
      'number.max': 'Year must be between 1 and 4'
    }),
    
  gender: Joi.string()
    .valid('Male', 'Female', 'Other')
    .required()
    .messages({
      'any.only': 'Gender must be Male, Female, or Other'
    }),
    
  section: Joi.string()
    .valid('A', 'B', 'C', 'D')
    .required()
    .messages({
      'any.only': 'Section must be A, B, C, or D'
    })
});

/**
 * Scan request validation schema
 */
export const scanRequestSchema = Joi.object({
  eventId: Joi.string()
    .pattern(/^[A-F0-9]{16}$/)
    .required()
    .messages({
      'string.pattern.base': 'Event ID must be a 16-character hexadecimal string'
    }),
    
  hallCode: Joi.string()
    .alphanum()
    .max(20)
    .when('$scanType', {
      is: 'hall',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'string.alphanum': 'Hall code can only contain letters and numbers'
    })
});

/**
 * Hall creation validation schema
 */
export const hallCreationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Hall name must be at least 2 characters long',
      'string.max': 'Hall name cannot exceed 100 characters'
    }),
    
  code: Joi.string()
    .alphanum()
    .uppercase()
    .min(2)
    .max(20)
    .required()
    .messages({
      'string.alphanum': 'Hall code can only contain letters and numbers',
      'string.uppercase': 'Hall code must be uppercase'
    }),
    
  capacity: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .required()
    .messages({
      'number.min': 'Capacity must be at least 1',
      'number.max': 'Capacity cannot exceed 10,000'
    }),
    
  isFoodCounter: Joi.boolean()
    .default(false)
});

/**
 * Volunteer creation validation schema
 */
export const volunteerCreationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s.'-]+$/)
    .required(),
    
  email: Joi.string()
    .email()
    .max(254)
    .required(),
    
  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    }),
    
  assignedHall: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid hall ID format'
    })
});

/**
 * Create validation middleware
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} source - Source of data ('body', 'query', 'params')
 * @returns {Function} - Express middleware function
 */
export function validateRequest(schema, source = 'body') {
  return (req, res, next) => {
    const data = req[source];
    
    // Sanitize string fields
    const sanitizedData = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (typeof value === 'string') {
        if (key === 'email') {
          sanitizedData[key] = sanitizeEmail(value);
        } else if (key === 'phone') {
          sanitizedData[key] = normalizePhone(value);
        } else {
          sanitizedData[key] = sanitizeString(value);
        }
      } else {
        sanitizedData[key] = value;
      }
    });
    
    // Validate with Joi
    const { error, value } = schema.validate(sanitizedData, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: errorMessages
      });
    }
    
    // Replace request data with validated and sanitized data
    req[source] = value;
    next();
  };
}

/**
 * Rate limiting validation for file uploads
 */
export const fileUploadLimits = {
  fileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['.csv', '.xlsx', '.xls'],
  maxFiles: 1
};

/**
 * Validate file upload
 * @param {Object} file - Multer file object
 * @returns {Object} - Validation result
 */
export function validateFileUpload(file) {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  // Check file size
  if (file.size > fileUploadLimits.fileSize) {
    return { 
      isValid: false, 
      error: `File size too large. Maximum size is ${fileUploadLimits.fileSize / (1024 * 1024)}MB` 
    };
  }
  
  // Check file type
  const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
  if (!fileUploadLimits.allowedTypes.includes(fileExt)) {
    return { 
      isValid: false, 
      error: `Invalid file type. Allowed types: ${fileUploadLimits.allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true };
}