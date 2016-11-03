import Promise from 'bluebird';
import mongoose from 'mongoose';
mongoose.Promise = Promise;

import config from './index';

export default () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(config.database, (err) => {
      const { host, port } = mongoose.connection;

      if (err) {
        reject(err);
      } else {
        console.log(`Connected database: ${host}:${port}`);
        resolve();
      }
    });
  });
}
