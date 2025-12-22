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