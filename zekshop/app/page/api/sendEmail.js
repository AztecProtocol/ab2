import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../../env_mock.js";

const email = "nikolaykostadinov21@gmail.com";
const purchaseNumber = "1294352407";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

transporter
  .sendMail({
    to: `${email}`,
    subject: `Confirmation about successful purchase. Purchase number: ${purchaseNumber}`,
    text: `Thank you so much for shopping at ZeKshop! Your purchase number is: ${purchaseNumber}`,
    html: `<p>Thank you so much for shopping at ZeKshop! Your purchase number is:  <strong>${purchaseNumber}</p>`,
  })
  .then(() => {
    console.log("Email sent successfully!");
  })
  .catch((error) => {
    console.log("Error sending email: ", error);
  });
