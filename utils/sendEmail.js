const nodemailer = require("nodemailer");

const sendLoginEmail = async (email, username) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Login Alert - URL Shortener",
      html: `
        <h2>Hello ${username}</h2>
        <p>You have successfully logged into your URL Shortener account.</p>
        <p>If this was not you, please change your password immediately.</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Email error:", error);
  }
};

module.exports = sendLoginEmail;