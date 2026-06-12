import nodemailer from "nodemailer";
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const {
      orderId,
      uropayTransactionId,
      productName,
      amount,
      category,
      userEmail,
      userName,
      placedAt,
      status
    } = orderData;
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("[EmailService] EMAIL_USER or EMAIL_PASS environment variables are not set. Skipping sending confirmation email.");
      return false;
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    try {
      await transporter.verify();
      console.log("[EmailService] SMTP Transporter connection verified.");
    } catch (verifyError) {
      console.error("[EmailService] SMTP Transporter verification failed:", verifyError);
      return false;
    }
    const dateStr = placedAt ? new Date(placedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : (/* @__PURE__ */ new Date()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const mailOptions = {
      from: `"OmniCart" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmed: ${productName} (ID: ${orderId})`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #1e1b4b; background-color: #fcfbfe; border-radius: 16px; overflow: hidden; border: 1px solid #e9e3ff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed, #4c1d95); padding: 32px 24px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.05em;">OmniCart</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Your Premium Multi-category Store</p>
          </div>
          
          <!-- Content Body -->
          <div style="padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="width: 56px; height: 56px; background-color: #f5f3ff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; border: 1px solid #e9e3ff;">
                <span style="font-size: 28px; line-height: 56px; color: #7c3aed;">\u2713</span>
              </div>
              <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">Order Confirmed!</h2>
              <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Hi ${userName}, thank you for shopping with us!</p>
            </div>
            
            <div style="background-color: white; border-radius: 12px; padding: 24px; border: 1px solid #f3f4f6; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em; color: #7c3aed; font-weight: 700;">Order Details</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Product Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; text-align: right; color: #111827;">${productName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Category</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; text-align: right; color: #111827;">${category || "Shopping"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Amount Paid</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 700; text-align: right; color: #7c3aed; font-size: 16px;">\u20B9${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Order ID</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-family: monospace; font-size: 13px; text-align: right; color: #4b5563;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">UroPay Tx ID</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-family: monospace; font-size: 13px; text-align: right; color: #4b5563;">${uropayTransactionId || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Date Ordered</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; text-align: right; color: #111827;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;">Status</td>
                  <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #059669;">${status || "PLACED"}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin-top: 32px; margin-bottom: 12px;">
              <a href="https://omnicart-992111359826.us-west1.run.app/my-orders" style="background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.25); transition: background 0.2s;">
                View My Orders
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f5f3ff; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e9e3ff;">
            <p style="margin: 0 0 8px 0;">This is an automated order confirmation from OmniCart.</p>
            <p style="margin: 0;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} OmniCart Inc. All rights reserved.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email successfully sent to ${userEmail} for order ${orderId}`);
    return true;
  } catch (error) {
    console.error("[EmailService] Error sending email:", error);
    return false;
  }
};
export const sendConfirmationEmail = sendOrderConfirmationEmail;
