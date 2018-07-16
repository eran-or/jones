const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const sgMail = require('@sendgrid/mail');
const app = express();

const API_PORT = process.env.API_PORT || 3001;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.post("/contact", (req, res)=>{
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'e.or1976@gmail.com',
    from: req.body.email,
    subject: req.body.subject,
    text: `Mail subject: ${req.body.subject}\nMail content: \nFirst Name: ${req.body.firstName}\nLast Name: ${req.body.lastName}\nMail Address: ${req.body.email}\nPhone Number: ${req.body.phone}`,
    html: `<div dir="ltr"><strong>Mail subject: </strong>${req.body.subject}<br><strong dir="ltr">Mail content: </strong>
    <br><strong>First Name:</strong> ${req.body.firstName}<br><strong>Last Name:</strong> ${req.body.lastName}<br><strong>Mail Address:</strong> ${req.body.email}<br><strong>Phone Number:</strong> ${req.body.phone}</div>`,
  };
  sgMail.send(msg);
  return res.status(200).json({});  
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
