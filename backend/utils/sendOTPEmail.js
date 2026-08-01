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
      from: `"Diamond Square" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Diamond Square - Email Verification OTP",
      html: `
        <h2>Diamond Square Society</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email Error:", err);
    throw err;
  }
};

module.exports = sendOTPEmail;