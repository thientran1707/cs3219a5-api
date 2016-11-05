'use strict';

import Subscription from '../model/Subscription';
import { retrieveNotificationForSubscription } from '../api/github';

class SubscriptionController {
  
  getAllSubscriptions(req, res) {
    return Subscription.find({})
    .then((subscriptions) => {
      res.status(200).json({ subscriptions });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message
      });
    });
  }

  createSubscription(req, res) {
    const { email, repo } = req.query;
    if (!email || !repo) {
      res.status(400).json({
        error: 'Email and repo required'
      });

      return;
    }

    // find email
    return Subscription.findOne({ email: email.toLowerCase() })
    .then((subscription) => {
      if (!subscription) {
        const newSubscription = new Subscription();
        newSubscription.email = email;
        newSubscription.repos = [repo];
        newSubscription.last_used = new Date().toISOString();

        //console.log('New subscription: ', newSubscription);
        return newSubscription.save();
      } else {
        return subscription;
      }
    })
    .then((subscription) => {
      //console.log('Subscription: ', subscription);
      res.status(200).json({
        message: 'Subscription created successfully',
        subscription: subscription
      });
    })
    .catch((err) => {
      console.log('Error: ', err);
      res.status(500).json({
        error: err.message
      });
    });
  }

  addSubscriptionToRepo(req, res) {
    const { email, repo } = req.query;
    if (!email || !repo) {
      res.status(400).json({
        error: 'Email and repo required'
      });

      return;
    }

    return Subscription.findOne({ email: email.toLowerCase() })
    .then((subscription) => {
      console.log('Subscription: ', subscription);
      const repos = subscription.repos;
      if (repos.indexOf(repo) === -1) {
        subscription.repos.push(repo);
      }

      return subscription.save();
    })
    .then((subscription) => {
      res.status(200).json({
        message: `Subscription for email ${email} to repo ${repo} added successfully`,
        subscription: subscription
      });
    })
    .catch((err) => {
      console.log('Error: ', err);
      res.status(500).json({
        error: err.message
      });
    });
  }

  getNotiMessageForSubscription(req, res) {
    const { email } = req.query;
    if (!email) {
      res.status(404).json({
        error: 'Email required'
      });

      return;
    }

    return Subscription.findOne({ email: email })
    .then((subscription) => {
      if (!subscription) {
        return;
      }

      const { repos, last_used } = subscription;
      return retrieveNotificationForSubscription(email, repos, last_used);
    })
    .then((notiMessage) => {
      res.status(200).json(notiMessage);
    })
    .catch((err) => {
      console.log('Error: ', err);
      res.status(500).json({
        error: err.message
      });
    });
  }

  updateVisitTime(email) {
    Subscription.findOne({ email: email })
    .then((subscription) => {
      console.log('Old last_used: ', subscription.last_used);
      subscription.last_used = new Date();

      return subscription.save();
    })
    .then((subscription) => {
      console.log('User last used time udpated successfully to ' + subscription.last_used);
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  }
}

export default SubscriptionController;
