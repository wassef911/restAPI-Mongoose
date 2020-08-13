const sgMail = require("@sendgrid/mail");

const sendWelcomeEmail = async (email, name) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: "1.wassef911@gmail.com",
      subject: `Thanks for joining in ${name}!`,
      text: "Let us know if you like the app.",
    };
    await sgMail.send(msg);
    console.log("Welcome Email sent.");
  } catch (error) {
    console.log(error.response.body);
  }
};

const sendCancelEmail = async (email, name) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: "1.wassef911@gmail.com",
      subject: `Sorry to see you go ${name}`,
      text: "We hope you comeback bro! ",
    };
    await sgMail.send(msg);
    console.log("Cancel Email sent.");
  } catch (error) {
    console.log(error.response.body);
  }
};

module.exports = { sendCancelEmail, sendWelcomeEmail };
