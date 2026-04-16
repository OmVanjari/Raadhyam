import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// BREVO CONFIG
const BREVO_API_KEY = process.env.BREVO_API;
const BREVO_SENDER_NAME = "Raadhyam";
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER;

console.log("Brevo Config - API Key:", BREVO_API_KEY ? "Set" : "Not Set");
console.log("Brevo Config - Sender Email:", BREVO_SENDER_EMAIL);

// BREVO CLIENT
const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "api-key": BREVO_API_KEY,
    "Content-Type": "application/json"
  }
});

/**
 * Send password reset OTP email
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - One-time password
 * @param {string} name - Recipient name
 * @returns {Promise<boolean>} - Success status
 */
export const sendPasswordResetOTP = async (toEmail, otp, name) => {
  console.log("sendPasswordResetOTP called with:", { toEmail, otp, name });
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2c3e50;
            margin: 0;
          }
          .otp-box {
            background-color: #3498db;
            color: white;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            letter-spacing: 5px;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          
          <p>Hello <b>${name || "User"}</b>,</p>
          
          <p>We received a request to reset your password for your Raadhyam account. Use the OTP below to verify your identity and proceed with the password reset.</p>
          
          <div class="otp-box">${otp}</div>
          
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            If you did not request this password reset, please ignore this email. Your account remains secure.
          </div>
          
          <p>If you have any questions, feel free to contact our support team.</p>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Raadhyam. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await brevoClient.post("/smtp/email", {
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL
      },
      to: [
        {
          email: toEmail,
          name: name || "User"
        }
      ],
      subject: "Password Reset OTP - Raadhyam",
      htmlContent: html
    });

    console.log("Brevo API response:", response.data);
    console.log("Password reset OTP email sent successfully:", toEmail);
    return true;

  } catch (error) {
    console.error("Error sending password reset OTP email:");
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data);
    console.error("Full error:", error);
    throw new Error("Failed to send password reset email");
  }
};

/**
 * Send welcome email
 * @param {string} toEmail - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<boolean>} - Success status
 */
export const sendWelcomeEmail = async (toEmail, name) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2c3e50;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Raadhyam!</h1>
          </div>
          
          <p>Hello <b>${name || "User"}</b>,</p>
          
          <p>Thank you for joining Raadhyam. We're excited to have you on board!</p>
          
          <p>Your account has been successfully created. You can now log in and start exploring our platform.</p>
          
          <p>If you have any questions, feel free to contact our support team.</p>
          
          <p>Best regards,<br>The Raadhyam Team</p>
        </div>
      </body>
      </html>
    `;

    await brevoClient.post("/smtp/email", {
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL
      },
      to: [
        {
          email: toEmail,
          name: name || "User"
        }
      ],
      subject: "Welcome to Raadhyam!",
      htmlContent: html
    });

    console.log("Welcome email sent successfully:", toEmail);
    return true;

  } catch (error) {
    console.error("Error sending welcome email:", error.response?.data || error.message);
    throw new Error("Failed to send welcome email");
  }
};

export default {
  sendPasswordResetOTP,
  sendWelcomeEmail
};
