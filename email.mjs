import nodemailer from "nodemailer";
import "dotenv/config";

var transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, body) => {
  await transport.sendMail({
    from: "apple Server <a@apple.com>",
    to,
    subject,
    html: body,
  });
};

export { sendEmail };
