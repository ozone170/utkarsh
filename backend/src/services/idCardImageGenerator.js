import sharp from 'sharp';
import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate ID card image for a user
 * @param {Object} user - User object with profile information
 * @returns {Buffer} - Image buffer (JPEG)
 */
export const generateIdCardImage = async (user) => {
  try {
    // Create a canvas-like image using Sharp - Credit card size
    const width = 800;
    const height = 500;
    
    // Create base image with professional gradient background
    const baseImage = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 30, g: 41, b: 59, alpha: 1 } // Dark professional background
      }
    })
    .png()
    .toBuffer();

    // Create main white content area with rounded corners effect
    const whiteCard = await sharp({
      create: {
        width: width - 40,
        height: height - 40,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    // Create header accent bar
    const headerBar = await sharp({
      create: {
        width: width - 40,
        height: 80,
        channels: 4,
        background: { r: 99, g: 102, b: 241, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    // Generate QR code
    let qrCodeBuffer;
    try {
      const qrData = JSON.stringify({
        id: user.eventId || user._id,
        name: user.name,
        role: 'STUDENT',
        type: 'id_card'
      });

      qrCodeBuffer = await QRCode.toBuffer(qrData, {
        width: 120,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    } catch (qrError) {
      console.warn('Could not generate QR code:', qrError);
      // Create a placeholder QR code area
      qrCodeBuffer = await sharp({
        create: {
          width: 120,
          height: 120,
          channels: 4,
          background: { r: 243, g: 244, b: 246, alpha: 1 }
        }
      })
      .png()
      .toBuffer();
    }

    // Create enhanced text overlays using SVG
    const headerSvg = `
      <svg width="${width - 40}" height="80">
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
          </linearGradient>
        </defs>
        <text x="30" y="35" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="url(#textGradient)">UTKARSH 2025</text>
        <text x="30" y="55" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">Event Management System</text>
        <text x="30" y="70" font-family="Arial, sans-serif" font-size="12" fill="#cbd5e1">Official Event ID Card</text>
      </svg>
    `;

    // Student-specific styling (since only students can access ID cards)
    const roleColor = '#2563eb';
    const roleIcon = '🎓';

    const userInfoSvg = `
      <svg width="${width - 200}" height="280">
        <defs>
          <linearGradient id="roleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${roleColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${roleColor};stop-opacity:0.8" />
          </linearGradient>
        </defs>
        
        <!-- Name -->
        <text x="30" y="40" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#1e293b">${user.name || 'N/A'}</text>
        
        <!-- Role Badge -->
        <rect x="30" y="55" width="120" height="30" rx="15" fill="url(#roleGradient)"/>
        <text x="50" y="75" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">${roleIcon} STUDENT</text>
        
        <!-- Program Info -->
        ${user.program && user.year ? `<text x="30" y="110" font-family="Arial, sans-serif" font-size="16" fill="#475569" font-weight="600">📚 ${user.program} - Year ${user.year}</text>` : ''}
        

        
        <!-- Event ID -->
        <rect x="30" y="155" width="300" height="35" rx="8" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2"/>
        <text x="40" y="175" font-family="Arial, sans-serif" font-size="14" fill="#64748b" font-weight="600">Event ID:</text>
        <text x="120" y="175" font-family="Courier New, monospace" font-size="16" fill="#1e293b" font-weight="bold">${user.eventId || user._id}</text>
        
        <!-- Contact Info -->
        ${user.email ? `<text x="30" y="210" font-family="Arial, sans-serif" font-size="12" fill="#64748b">📧 ${user.email}</text>` : ''}
        ${user.phone ? `<text x="30" y="230" font-family="Arial, sans-serif" font-size="12" fill="#64748b">📱 ${user.phone}</text>` : ''}
        
        <!-- Footer -->
        <text x="30" y="260" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">Valid for UTKARSH 2025 Event • Generated: ${new Date().toLocaleDateString('en-IN')}</text>
      </svg>
    `;

    // Create QR code background
    const qrBackground = await sharp({
      create: {
        width: 140,
        height: 140,
        channels: 4,
        background: { r: 248, g: 250, b: 252, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    // Compose the final image with enhanced layout
    let finalImage = sharp(baseImage)
      .composite([
        {
          input: whiteCard,
          top: 20,
          left: 20
        },
        {
          input: headerBar,
          top: 20,
          left: 20
        },
        {
          input: Buffer.from(headerSvg),
          top: 20,
          left: 20
        },
        {
          input: Buffer.from(userInfoSvg),
          top: 120,
          left: 20
        },
        {
          input: qrBackground,
          top: 280,
          left: width - 180
        },
        {
          input: qrCodeBuffer,
          top: 290,
          left: width - 170
        }
      ]);

    // Add QR code label
    const qrLabelSvg = `
      <svg width="140" height="20">
        <text x="70" y="15" font-family="Arial, sans-serif" font-size="10" fill="#64748b" text-anchor="middle" font-weight="600">SCAN TO VERIFY</text>
      </svg>
    `;

    finalImage = finalImage.composite([
      {
        input: Buffer.from(qrLabelSvg),
        top: 435,
        left: width - 180
      }
      ]);

    // Add profile photo placeholder or actual photo
    let photoElement;
    if (user.profilePhoto?.idCard) {
      try {
        const photoPath = path.join(process.cwd(), user.profilePhoto.idCard.replace('/uploads/', 'uploads/'));
        const photoBuffer = await fs.readFile(photoPath);
        photoElement = await sharp(photoBuffer)
          .resize(120, 120, { fit: 'cover' })
          .jpeg()
          .toBuffer();
      } catch (photoError) {
        console.warn('Could not load profile photo for ID card');
        photoElement = null;
      }
    }

    if (!photoElement) {
      // Create a professional placeholder
      const placeholderSvg = `
        <svg width="120" height="120">
          <defs>
            <linearGradient id="photoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#e2e8f0;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="120" height="120" fill="url(#photoGradient)" rx="8"/>
          <circle cx="60" cy="45" r="20" fill="#94a3b8"/>
          <path d="M30 85 Q30 75 40 75 L80 75 Q90 75 90 85 L90 95 Q90 105 80 105 L40 105 Q30 105 30 95 Z" fill="#94a3b8"/>
          <text x="60" y="115" font-family="Arial, sans-serif" font-size="8" fill="#64748b" text-anchor="middle">PHOTO</text>
        </svg>
      `;
      photoElement = Buffer.from(placeholderSvg);
    }

    // Add photo to the card
    finalImage = finalImage.composite([
      {
        input: photoElement,
        top: 140,
        left: width - 160
      }
    ]);

    // Convert to JPEG and return
    const result = await finalImage
      .jpeg({ quality: 95 })
      .toBuffer();

    return result;
  } catch (error) {
    console.error('Error generating ID card image:', error);
    throw error;
  }
};