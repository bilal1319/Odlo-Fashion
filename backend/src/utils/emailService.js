// utils/emailService.js
import nodemailer from 'nodemailer';

// Generate random code
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
export async function sendVerificationEmail(email, code) {
  console.log('='.repeat(50));
  console.log('📧 EMAIL DEBUG INFO');
  console.log('To:', email);
  console.log('Code:', code);
  console.log('User:', process.env.BREVO_SMTP_USER);
  console.log('Password length:', process.env.BREVO_SMTP_PASSWORD?.length);
  console.log('='.repeat(50));
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Test connection first
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection successful!');

    // Send email
    console.log('Sending email...');
    const info = await transporter.sendMail({
      from: '"ODLO" <bilalkhsherwani1319@gmail.com>', // Use exact Brevo verified email
      to: email,
      subject: 'Verify Your Email - ODLO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">ODLO</h1>
          </div>
          <div style="padding: 30px;">
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; margin: 20px 0; letter-spacing: 5px; background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px;">
              ${code}
            </div>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    return { 
      success: true, 
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('❌ EMAIL ERROR DETAILS:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Response:', error.response);
    console.error('='.repeat(50));
    
    return { 
      success: false, 
      error: error.message 
    };
  }
}


export async function sendPasswordResetEmail(email, code) {
  console.log('='.repeat(50));
  console.log('🔐 PASSWORD RESET EMAIL DEBUG');
  console.log('To:', email);
  console.log('Reset Code:', code);
  console.log('='.repeat(50));
  
  try {
    // Create transporter (same as verification email)
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Test connection
    console.log('Testing SMTP connection for password reset...');
    await transporter.verify();
    console.log('SMTP connection successful!');

    // Send password reset email
    console.log('Sending password reset email...');
    const info = await transporter.sendMail({
      from: '"ODLO Support" <bilalkhsherwani1319@gmail.com>',
      to: email,
      subject: 'Password Reset Request - ODLO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">ODLO</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Password Reset</p>
          </div>
          <div style="padding: 30px;">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Use the code below to continue:</p>
            
            <div style="font-size: 32px; font-weight: bold; margin: 20px 0; letter-spacing: 5px; background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; border: 2px dashed #000;">
              ${code}
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Important:</strong> This code will expire in 30 minutes. If you didn't request a password reset, please ignore this email or contact support if you're concerned.
            </p>
            
            <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333;">Need help?</h3>
              <p style="margin-bottom: 0; font-size: 14px;">
                If you're having trouble resetting your password, please reply to this email or contact our support team.
              </p>
            </div>
          </div>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
            <p style="margin: 0;">This is an automated message from ODLO. Please do not reply to this email.</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Password reset email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    return { 
      success: true, 
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('❌ PASSWORD RESET EMAIL ERROR:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Response:', error.response);
    console.error('='.repeat(50));
    
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Send password change confirmation email
export async function sendPasswordChangeConfirmation(email) {
  console.log('='.repeat(50));
  console.log('✅ PASSWORD CHANGE CONFIRMATION EMAIL');
  console.log('To:', email);
  console.log('='.repeat(50));
  
  try {
    // Create transporter (same as before)
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Send confirmation email
    const info = await transporter.sendMail({
      from: '"ODLO Security" <bilalkhsherwani1319@gmail.com>',
      to: email,
      subject: 'Password Changed Successfully - ODLO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #28a745; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">✅ Password Updated</h1>
          </div>
          <div style="padding: 30px;">
            <h2>Security Notice</h2>
            <p>Your ODLO account password was successfully changed on <strong>${new Date().toLocaleString()}</strong>.</p>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #2e7d32;">What you should know:</h3>
              <ul style="margin-bottom: 0;">
                <li>Your new password is now active</li>
                <li>You'll need to use this password for all future logins</li>
                <li>If you use the same password on other sites, consider updating them too</li>
              </ul>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border: 1px solid #ffeaa7; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #856404;">⚠️ Didn't make this change?</h4>
              <p style="margin-bottom: 0; color: #856404;">
                If you didn't change your password, please contact our support team immediately at 
                <a href="mailto:support@odlo.com" style="color: #856404; font-weight: bold;">support@odlo.com</a>
              </p>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/signin" 
                 style="background: #000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Sign In to Your Account
              </a>
            </p>
          </div>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
            <p style="margin: 0;">This is a security notification from ODLO. For your safety, do not share this email.</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Password change confirmation sent!');
    console.log('Message ID:', info.messageId);
    
    return { 
      success: true, 
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('❌ PASSWORD CONFIRMATION EMAIL ERROR:');
    console.error('Error:', error.message);
    
    // Don't throw error for confirmation email - it's optional
    return { 
      success: false, 
      error: error.message,
      note: 'Confirmation email failed but password was reset successfully'
    };
  }
}