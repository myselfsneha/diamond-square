const axios = require("axios");

const sendOtpSms = async (phone, otp) => {
  try {
    await axios.post(
      "https://api.msg91.com/api/v5/flow/",
      {
        flow_id: process.env.MSG91_FLOW_ID,
        sender: process.env.MSG91_SENDER_ID,
        mobiles: `91${phone}`,
        OTP: otp,
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return true;
  } catch (err) {
    console.error(err.response?.data || err.message);
    return false;
  }
};

module.exports = sendOtpSms;