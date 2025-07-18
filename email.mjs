import nodemailer from "nodemailer";

// // Create a test account or replace with real credentials.
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: "maddison53@ethereal.email",
//     pass: "jn7jnAPss4f63QBp6D",
//   },
// });

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "887c25528eb947",
    pass: "97e8a349acac94",
  },
});

const sendEmail = async (to, subject, body) => {
  const info = await transport.sendMail({
    from: "apple Server <a@apple.com>",
    to,
    subject,
    html: body,
  });
};

export { sendEmail };
