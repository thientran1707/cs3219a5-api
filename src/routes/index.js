import { Router } from 'express';
import GithubController from '../controllers/GithubController';

export default () => {
  const router = Router();
  const Github = new GithubController();

  router.get('/contributors', Github.retrieveContributor);
  router.get('/member/commits', Github.retrieveMemberCommitHistory);
  router.get('/file', Github.retrieveFileChangeHistory);

  // used to test server
  router.get('/test', (req, res) => {
    res.status(200).json({
      status: 'Test succesfully'
    });
  });

  return router;
}