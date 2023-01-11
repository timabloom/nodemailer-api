require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
};

app.post("/", cors(corsOptions), async (req, res) => {
  const { email, subject, message } = req.body;
  const emailType = typeof email;
  const subjectType = typeof subject;
  const messageType = typeof message;

  if (
    emailType === "string" &&
    subjectType === "string" &&
    messageType === "string"
  ) {
    async function main() {
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: `${process.env.SECRET_USER}`,
          pass: `${process.env.SECRET_PASS}`,
        },
      });

      let info = await transporter.sendMail({
        from: `<${email}>`,
        to: `${process.env.SECRET_TO}`,
        subject: `${subject}`,
        text: `${message}`,
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
