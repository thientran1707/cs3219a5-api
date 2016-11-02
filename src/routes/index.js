import { Router } from 'express';
import GithubController from '../controllers/GithubController';

export default () => {
  const router = Router();
  const Github = new GithubController();

  router.get('/contributors', Github.retrieveContributor);
  router.get('/member/commits', Github.retrieveMemberCommitHistory);

  return router;
}