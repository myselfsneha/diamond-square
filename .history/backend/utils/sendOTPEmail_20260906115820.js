const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Diamond Square Society" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Diamond Square - Email Verification OTP",
      html: `
        <div style="font-family:Arial,sans-serif;background:#f5f7fb;padding:30px;">
          <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;padding:35px;border:1px solid #e5e7eb;">

            <div style="text-align:center;">
              <h1 style="color:#2563eb;margin-bottom:5px;">
                🏢 Diamond Square Society
              </h1>

              <p style="color:#6b7280;margin-top:0;">
                Secure Society Management Portal
              </p>
            </div>

            <hr style="margin:25px 0;border:none;border-top:1px solid #e5e7eb;" />

            <p style="font-size:16px;color:#374151;">
              Hello,
            </p>

            <p style="font-size:15px;color:#374151;line-height:1.7;">
              Use the following One-Time Password (OTP) to continue.
            </p>

            <div style="text-align:center;margin:35px 0;">
              <span style="
                display:inline-block;
                background:#2563eb;
                color:#fff;
                padding:16px 34px;
                border-radius:12px;
                font-size:34px;
                font-weight:bold;
                letter-spacing:8px;
              ">
                ${otp}
              </span>
            </div>

            <p style="font-size:15px;color:#374151;">
              This OTP is valid for <strong>10 minutes</strong>.
            </p>

            <p style="font-size:15px;color:#374151;">
              Please do not share this OTP with anyone.
            </p>
            