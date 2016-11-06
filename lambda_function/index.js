'use strict';

var nodemailer = require('nodemailer');
var request = require('request-promise');
var API_URL = 'http://ec2-54-179-159-147.ap-southeast-1.compute.amazonaws.com:3000/api/'; // API server for GitGuard

// create transporter using default SMTP transport
var transporter = nodemailer.createTransport('smtps://cs3219.team7%40gmail.com:01279289861@smtp.gmail.com');
var SENDER = 'cs3217.team7@gmail.com';

exports.handler = (event, context) => {
  sendNotifications();
};

function sendNotifications() {
  var subscription_url = API_URL + 'subscription/';

  return fetch(subscription_url + 'all')
  .then(function(subscriptions) {
    subscriptions = subscriptions.subscriptions;

    for (var i = 0; i < subscriptions.length; i++) {
      var email = subscriptions[i].email;
      var last_used = subscriptions[i].last_used;

      retrieveSubscriptionMessage(email)
      .then(function(result) {
        var content = {};
        content.email = result.email;
        content.subject = 'Notification about update since your last visit on ' + result.last_visit;
        content.message = result.html;
        content.html = result.html;

        sendEmail(content, function(err, data) {
          console.log('Error: ', JSON.stringify(err));
          context.done(err, { message: data }); 
        });
      });
    }
  })
  .catch(function(err) {
    console.log('Error: ');
    console.log(err);
  });
}

function retrieveSubscriptionMessage(email) {
  var url = API_URL + 'notification';
  var qs = {
    email: email
  };

  return fetch(url, qs);
}

function fetch(url, qs) {
  var options = {
    uri: url,
    qs: qs,
    json: true
  };

  return request(options);
}

function sendEmail(content, done) {
  var receiver = content.email;
  var subject = content.subject;
  var message = content.message;
  var html = content.html;

  var mailOptions = {
    from: SENDER,
    to: receiver,
    subject: subject,
    text: message,
    html: html
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log('Error: ', err);
      return err;
    }

    console.log('Message sent to ' + receiver);
    console.log('Info: ' + info.response);
    return info.response;
  });
}
