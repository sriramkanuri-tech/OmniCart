import nodemailer from "nodemailer";

export const sendOrderConfirmationEmail = async (orderData: any): Promise<boolean> => {
  const { 
    orderId, productName, userEmail, userName
  } = orderData;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("[EmailService] EMAIL_USER or EMAIL_PASS environment variables are missing.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const mailOptions = {
      from: `"OmniCart" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `✅ Order Confirmed - OmniCart Order #${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px;">
          <h2 style="color: #4f46e5;">Order Confirmed!</h2>
          <p>Hi ${userName},</p>
          <p>Thank you for your order! Your order for <strong>${productName}</strong> has been confirmed.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 14px; color: #718096;">
            If you have any questions, please reply to this email or contact support at ${process.env.EMAIL_USER}.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Confirmation email sent to ${userEmail}. ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    logSMTPError("Order Confirmation", userEmail, error);
    return false;
  }
};

/**
 * Sends a notification email to the admin about a new order.
 */
export const sendAdminNotificationEmail = async (orderData: any): Promise<boolean> => {
  const { orderId, productName, amount, userEmail } = orderData;
  const adminEmail = "omnicart.support.team@gmail.com";

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const mailOptions = {
      from: `"OmniCart System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🛒 New Order Received - ${productName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #4f46e5;">New Order Alert</h2>
          <p>A new order has been placed on OmniCart.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Order ID</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Product</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${productName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Amount</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Customer</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${userEmail}</td>
            </tr>
          </table>
          <p style="font-size: 14px; color: #94a3b8;">System notification generated at ${new Date().toISOString()}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Admin notification sent. ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    logSMTPError("Admin Notification", adminEmail, error);
    return false;
  }
};

/**
 * Checks the status of the SMTP connection.
 */
export const getSMTPStatus = async (): Promise<{ status: string; error?: string }> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return { status: "MISSING_CREDENTIALS", error: "EMAIL_USER or EMAIL_PASS not configured" };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 5000, // 5 seconds
  });

  try {
    await transporter.verify();
    return { status: "CONNECTED" };
  } catch (error: any) {
    let errorType = "CONNECTION_FAILED";
    if (error.code === 'EAUTH') errorType = "AUTHENTICATION_FAILED";
    if (error.code === 'ETIMEDOUT') errorType = "TIMEOUT";
    if (error.code === 'ECONNECTION') errorType = "NETWORK_ERROR";
    
    return { status: errorType, error: error.message };
  }
};

/**
 * Helper to log detailed SMTP errors.
 */
function logSMTPError(context: string, recipient: string, error: any) {
  console.error(`[EmailService] ${context} ERROR to ${recipient}:`);
  
  if (error.code === 'EAUTH') {
    console.error(" - TYPE: Authentication Failed (EAUTH)");
    console.error(" - FIX: Ensure EMAIL_USER is correct and EMAIL_PASS is a 16-digit Google App Password.");
  } else if (error.code === 'ECONNECTION') {
    console.error(" - TYPE: Network/Connection Error (ECONNECTION)");
    console.error(" - FIX: Check internet connectivity or if Gmail SMTP port 465 is blocked.");
  } else if (error.code === 'ETIMEDOUT') {
    console.error(" - TYPE: Timeout Error (ETIMEDOUT)");
    console.error(" - FIX: SMTP server took too long to respond.");
  } else {
    console.error(` - TYPE: ${error.code || 'Unknown'}`);
    console.error(` - MESSAGE: ${error.message}`);
  }
}

// Aliased helper for backwards compatibility
export const sendConfirmationEmail = sendOrderConfirmationEmail;

/**
 * Sends a high-security OTP email using Gmail SMTP.
 * @param email Recipient email address
 * @param otp The 6-digit OTP code
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("[EmailService] Cannot send OTP: EMAIL_USER or EMAIL_PASS environment variables are missing.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
  } catch (error: any) {
    console.error("[EmailService] SMTP Authentication failed during OTP send attempt:", error.message);
    return false;
  }

  const mailOptions = {
    from: `"OmniCart Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Verification Code - OmniCart",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; color: #1a202c;">
        <h2 style="color: #4f46e5; margin-bottom: 24px;">Security Verification</h2>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Use the following one-time password (OTP) to complete your high-security verification. This code is valid for 10 minutes.
        </p>
        <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1a202c;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #718096; margin-bottom: 0;">
          If you did not request this code, please ignore this email or contact support if you suspect unauthorized activity.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] OTP email successfully sent to ${email}`);
    return true;
  } catch (error: any) {
    console.error(`[EmailService] Failed to send OTP email to ${email}:`, error.message);
    return false;
  }
};
