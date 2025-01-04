const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    },
  });

  const mailOptions = {
    from: 'Studyy <your-email@example.com>'
    ,
    to: email,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("email send")
    return true
  } catch (error) {
    console.log("error on sending email:", error)
  }
};

module.exports = sendEmail;