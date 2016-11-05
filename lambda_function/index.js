'use strict';

var nodemailer = require('nodemailer');

// create transporter using default SMTP transport
var transporter = nodemailer.createTransport('smtps://cs3219.team7%40gmail.com:01279289861@smtp.gmail.com');

var SENDER = 'cs3217.team7@gmail.com';

exports.handler = (event, context) => {
  sendEmail(event, function(err, data) {
    console.log('Error: ', JSON.stringify(err));
    context.done(err, { message: data }); 
  });
};

function sendEmail(event, done) {
  var receiver = event.email;
  var name = event.name;
  var subject = event.subject;
  var message = event.message;
  var html = event.html;

  var mailOptions = {
    from: SENDER,
    to: receiver,
    subject: subject,
    text: message,
    html: html
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      return err;
    }

    console.log('Message sent: ', info.response);
    return info.response;
  });
}
