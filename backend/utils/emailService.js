import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email service configuration error:', error.message);
        console.warn('⚠️  Email OTP will not work. Please configure EMAIL_USER and EMAIL_PASSWORD in .env');
    } else {
        console.log('✅ Email service is ready');
    }
});

/**
 * Send OTP email
 */
export const sendOTPEmail = async (email, name, otp) => {
    try {
        const mailOptions = {
            from: `"SportsConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your SportsConnect Verification Code',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 SportsConnect</h1>
              <p>Verification Code</p>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thank you for signing up with SportsConnect! Use the verification code below to complete your registration:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p><strong>This code will expire in 5 minutes.</strong></p>
              <p>If you didn't request this code, please ignore this email.</p>
              
              <div class="footer">
                <p>© 2026 SportsConnect. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Failed to send OTP email:', error.message);
        throw new Error('Failed to send verification email');
    }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: `"SportsConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to SportsConnect! 🎉',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 Welcome to SportsConnect!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Welcome to the SportsConnect community! 🎉</p>
              <p>You're now part of a vibrant community of sports enthusiasts. Start connecting with fellow athletes, discover local sports events, and build your sports network!</p>
              <p>Happy connecting!</p>
              <p><strong>The SportsConnect Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error.message);
        // Don't throw error for welcome email - it's not critical
    }
};
