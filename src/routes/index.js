import { Router } from 'express';
import GithubController from '../controllers/GithubController';
import SubscriptionController from '../controllers/SubscriptionController';
import NotificationController from '../controllers/NotificationController';

export default () => {
  const router = Router();
  const Github = new GithubController();
  const Subscription = new SubscriptionController();
  const Notification = new NotificationController();

  router.get('/contributors', Github.retrieveContributor);
  router.get('/member/commits', Github.retrieveMemberCommitHistory);
  router.get('/file', Github.retrieveFileChangeHistory);

  router.get('/subscription/all', Subscription.getAllSubscriptions);
  router.get('/subscription/create', Subscription.createSubscription);
  router.get('/subscription/add', Subscription.addSubscriptionToRepo);

  router.get('/notification', Subscription.getNotiMessageForSubscription);
  router.get('/notification/invoke', Notification.sendNotifications);

  // used to test server
  router.get('/test', (req, res) => {
    res.status(200).json({
      status: 'Test succesfully'
    });
  });

  return router;
}