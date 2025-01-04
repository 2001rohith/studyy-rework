const twilio = require('twilio');
const crypto = require("crypto");

const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber.startsWith('+')) {
    if (/^[6-9]\d{9}$/.test(phoneNumber)) {
      return `+91${phoneNumber}`;
    } else {
      throw new Error("Invalid phone number format");
    }
  }
  return phoneNumber;
};

const sendSMS = async (phoneNumber, message) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const normalizedNumber = normalizePhoneNumber(phoneNumber);
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: normalizedNumber
    });
    console.log("SMS sent");
    return true;
  } catch (error) {
    console.log("Error sending SMS:", error);
    return false;
  }
};

const sendOTP = async (phoneNumber) => {
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };
  
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000); 
  
    try {
      const message = `STUDYY - Your verification code is: ${otp}`;
      const smsSent = await sendSMS(phoneNumber, message);
      
      if (smsSent) {
        return { otp, otpExpires };
      } else {
        throw new Error("Failed to send SMS");
      }
    } catch (error) {
      console.log("Error in sendOTP:", error);
      throw error;
    }
  };
  
  module.exports = { sendSMS, sendOTP };