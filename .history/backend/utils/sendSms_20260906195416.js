const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Diamond Square Society" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Diamond Square Password Reset OTP",
      html: `
        <div style="font-family:Arial,sans-serif;padding:30px;background:#f5f7fb;">
          <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:12px;padding:30px;border:1px solid #e5e7eb;">
            <h2 style="color:#2563eb;margin-bottom:10px;">
              Diamond Square Society
            </h2>

            <p style="font-size:15px;color:#374151;">
              Hello,
            </p>

            <p style="font-size:15px;color:#374151;">
              We received a request to reset your password.
            </p>

            <div style="margin:30px 0;text-align:center;">
              <span style="display:inline-block;background:#2563eb;color:white;padding:14px 28px;border-radius:10px;font-size:30px;font-weight:bold;letter-spacing:8px;">
                ${otp}
              </span>
            </div>

            <p style="font-size:15px;color:#374151;">
              This OTP is valid for 10 minutes.
            </p>

            <p style="font-size:15px;color:#374151;">
              If you didn't request this, you can safely ignore this email.
            </p>

            <hr style="margin:25px 0;border:none;border-top:1px solid #e5e7eb;" />

            <p style="font-size:12px;color:#6b7280;text-align:center;">
              © 2026 Diamond Square Society
            </p>
          </div>
        </div>
      `,
    });
        return true;
  } catch (err) {
    console.error(
      "Email Error:",
      err.response?.data || err.message
    );

    return false;
  }
};

module.exports = sendOtpEmail;