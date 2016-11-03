import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routerConfig from './routes';

const app = express();
const port = 3000;

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

  console.info(`==> 🌎 Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
});
