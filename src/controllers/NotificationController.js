'use strict';
import aws from 'aws-sdk';
import config from '../config';

// init aws
aws.config = new aws.Config();
aws.config.accessKeyId = config.awsKeyId;
aws.config.secretAccessKey = config.awsAccessSecret;
aws.config.region = config.awsRegion;

const lambda = new aws.Lambda();
const params = {
  FunctionName: 'gitguar_email_sender',
  Payload: null
};

class NotificationController {
  
  sendNotifications(req, res) {
    // simple auth
    const { token } = req.query;
    if (token != config.authKey) {
      res.status(401).json({
        error: 'Unauthorized request'
      });

      return;
    }

    lambda.invoke(params, (err, data) => {
      if (err) {
        console.log('Error: ');
        console.log(err);
        res.status(500).json({
          error: err.message
        });
      } else {
        console.log('Data: ', data);
        res.status(200).json({
          message: data
        });
      }
    });
  }

}

export default NotificationController;
