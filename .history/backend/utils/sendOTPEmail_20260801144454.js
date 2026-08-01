const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Diamond Square" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Diamond Square - Mobile Verification OTP",
    html: `
      <h2>Diamond Square</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
};

module.exports = sendOTPEmail;