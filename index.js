require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { email, subject, message } = req.body;
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailTrue = emailRegex.test(email);
  const emailType = typeof email;
  const subjectType = typeof subject;
  const messageType = typeof message;

  if (
    emailTrue &&
    emailType === "string" &&
    subjectType === "string" &&
    messageType === "string"
  ) {
    async function main() {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SECRET_USER,
          pass: process.env.SECRET_PASS,
        },
      });

      let info = await transporter.sendMail({
        to: email,
        subject: `${subject}`,
        text: `Email: ${email}\nMessage: ${message}`,
      });

      console.log("Message sent: %s", info.messageId);
    }
    try {
      await main();
      res.status(204).end();
    } catch (error) {
      if (error.responseCode === 535) {
        res.statusMessage = "SMTP Error";
        res.status(535).end();
      } else {
        res.status(500).end();
      }
    }
  } else {
    res.status(400).end();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
