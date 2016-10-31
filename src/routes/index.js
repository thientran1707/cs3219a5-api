import { Router } from 'express';

export default () => {
  let router = Router();

  router.get('/test', (req, res) => {
    res.status(200).json({
      message: 'Success'
    });
  });

  return router;
}