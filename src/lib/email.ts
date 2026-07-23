import nodemailer from 'nodemailer';
import { sanitizeForEmailHtml } from './sanitize';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || '465';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.error('[EMAIL] Missing SMTP config:', {
      host: host ? 'SET' : 'MISSING',
      user: user ? 'SET' : 'MISSING',
      pass: pass ? 'SET' : 'MISSING',
    });
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port),
    secure: port === '465',
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.error('[EMAIL] SMTP not configured - email not sent:', options.subject);
    return false;
  }

  try {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log('[EMAIL] Sent successfully:', options.subject, '->', options.to);
    return true;
  } catch (error: any) {
    console.error('[EMAIL] Send failed:', options.subject, '->', options.to);
    console.error('[EMAIL] Error:', error.message || String(error));
    if (error.code) console.error('[EMAIL] Code:', error.code);
    if (error.response) console.error('[EMAIL] Response:', error.response);
    return false;
  }
}

export async function sendContactNotification(
  professionalEmail: string,
  clientName: string,
  clientEmail: string,
  subject: string,
  message: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
        .content { background: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
        .label { font-weight: bold; color: #1e293b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Client Inquiry</h1>
        </div>
        <div class="content">
          <p>You have received a new inquiry through your Philippine Skyland profile.</p>
          <h3>Client Information</h3>
          <p><span class="label">Name:</span> ${sanitizeForEmailHtml(clientName)}</p>
          <p><span class="label">Email:</span> ${sanitizeForEmailHtml(clientEmail)}</p>
          <h3>Message Details</h3>
          <p><span class="label">Subject:</span> ${sanitizeForEmailHtml(subject)}</p>
          <p><span class="label">Message:</span></p>
          <p>${sanitizeForEmailHtml(message)}</p>
        </div>
        <div class="footer">
          <p>This message was sent through your Philippine Skyland profile.</p>
          <p>&copy; ${new Date().getFullYear()} Philippine Skyland MGT and DEVT OPC (PPSMDO). All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: professionalEmail,
    subject: `New Inquiry: ${subject.replace(/[\r\n]/g, '').substring(0, 100)}`,
    html,
  });
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
  role: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Philippine Skyland!</h1>
        </div>
        <div class="content">
          <p>Hello ${sanitizeForEmailHtml(name)},</p>
          <p>Thank you for joining Philippine Skyland MGT and DEVT OPC (PPSMDO) as a ${sanitizeForEmailHtml(role)}.</p>
          <p>You can now access your dashboard and start using the platform.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Philippine Skyland MGT and DEVT OPC (PPSMDO). All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject: 'Welcome to Philippine Skyland!',
    html,
  });
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string,
  appUrl: string
): Promise<boolean> {
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
        .btn { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .note { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px; margin: 16px 0; font-size: 14px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email Address</h1>
        </div>
        <div class="content">
          <p>Hello ${sanitizeForEmailHtml(name)},</p>
          <p>Thank you for registering with Philippine Skyland. Please verify your email address by clicking the button below:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" class="btn">Verify Email Address</a>
          </p>
          <div class="note">
            <p><strong>Note:</strong> If you did not create an account, you can safely ignore this email. Your address will not be used.</p>
          </div>
          <p style="font-size: 12px; color: #64748b; word-break: break-all;">If the button doesn't work, copy and paste this link into your browser:<br/>${verifyUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Philippine Skyland MGT and DEVT OPC (PPSMDO). All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject: 'Verify Your Email - Philippine Skyland',
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string,
  appUrl: string
): Promise<boolean> {
  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
        .btn { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .note { background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 16px 0; font-size: 14px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello ${sanitizeForEmailHtml(name)},</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </p>
          <div class="note">
            <p><strong>This link expires in 1 hour.</strong> If you did not request a password reset, you can safely ignore this email. Your password will not be changed.</p>
          </div>
          <p style="font-size: 12px; color: #64748b; word-break: break-all;">If the button doesn't work, copy and paste this link into your browser:<br/>${resetUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Philippine Skyland MGT and DEVT OPC (PPSMDO). All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject: 'Reset Your Password - Philippine Skyland',
    html,
  });
}

export async function sendEmailChangeConfirmation(
  currentEmail: string,
  newEmail: string,
  token: string,
  appUrl: string
): Promise<boolean> {
  const confirmUrl = `${appUrl}/api/auth/confirm-email-change?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
        .btn { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .note { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px; margin: 16px 0; font-size: 14px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirm Email Change</h1>
        </div>
        <div class="content">
          <p>You requested to change your email address on Philippine Skyland.</p>
          <p><strong>From:</strong> ${currentEmail}</p>
          <p><strong>To:</strong> ${newEmail}</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" class="btn">Confirm Email Change</a>
          </p>
          <div class="note">
            <p><strong>This link expires in 1 hour.</strong> If you did not request this change, please ignore this email.</p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Philippine Skyland MGT and DEVT OPC (PPSMDO). All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: currentEmail,
    subject: 'Confirm Email Change - Philippine Skyland',
    html,
  });
}
