import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter verification failed:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

/**
 * Send ID card email to student
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {string} options.idCardFilename - Filename for ID card attachment
 * @param {string} options.idCardBase64 - Base64 encoded ID card image (with or without data URL prefix)
 */
export const sendIdCardEmail = async ({ to, subject, html, idCardFilename, idCardBase64 }) => {
  try {
    // Strip data URL prefix if present
    let base64Data = idCardBase64;
    if (idCardBase64.includes('base64,')) {
      base64Data = idCardBase64.split('base64,')[1];
    }

    // Convert base64 to Buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Email options
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      attachments: [
        {
          filename: idCardFilename,
          content: imageBuffer,
          contentType: 'image/png',
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ ID card email sent successfully:', {
      timestamp: new Date().toISOString(),
      messageId: info.messageId,
      to,
      subject,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    // Enhanced error logging for ID card emails
    console.error('❌ Failed to send ID card email:', {
      timestamp: new Date().toISOString(),
      to,
      subject,
      error: error.message,
      code: error.code,
      command: error.command,
    });
    
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Send simple notification email (without attachment)
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Notification email sent successfully:', {
      timestamp: new Date().toISOString(),
      messageId: info.messageId,
      to,
      subject,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    // Enhanced error logging for notification emails
    console.error('❌ Failed to send notification email:', {
      timestamp: new Date().toISOString(),
      to,
      subject,
      error: error.message,
      code: error.code,
      command: error.command,
    });
    
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

export default { sendIdCardEmail, sendEmail };
