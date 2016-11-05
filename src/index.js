import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routerConfig from './routes';
import configDB from './config/database';

const app = express();
const port = 3000;

configDB().then(() => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors({
    origin: '*',
    withCredentials: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
   }));

  app.use('/api', routerConfig());

  app.listen(port, (err) => {
    if (err) {
      console.log(`Error: ${JSON.stringify(err)}`);
    }

    console.info(`==> 🌎 Listening on port ${port}. API server running at http://localhost:${port}`);
  });
})
.catch((err) => {
  console.log('Error: ', err.message);;
})
