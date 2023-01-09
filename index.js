const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  res.send("Server responding");
  const { email } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "marisol58@ethereal.email",
      pass: "CBMKvaSjZ8mzKqA521",
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: `${email}`,
    subject: "Hello ✔",
    text: "Hello world?",
  });

  console.log("Message sent: %s", info.messageId);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
