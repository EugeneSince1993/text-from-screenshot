import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import cron from "cron";
const CronJob = cron.CronJob;
import router from './routes/index.js';

let port = process.env.PORT || 5001;

export let iam_token;

const main = async () => {
  const app = express();
  
  app.use(express.json());
  app.use(cors());
  app.use('/api', router);

  const getIAMtoken = async () => {
    const { data } = await axios.get("https://functions.yandexcloud.net/d4elbljl4172vcrh4k8l");
    iam_token = data.access_token;
  };

  getIAMtoken().then(() => {
    console.log('iam token received at the first time: ', iam_token);
  });

  console.log('Before job instantiation');
  const job = new CronJob('0 * * * *', function() {
    getIAMtoken().then(() => {
      console.log('iam token received every hour: ', iam_token);
    });
  });
  console.log('After job instantiation');
  job.start();

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./../client/build'));
  
    app.get('/*', (req, res) => {
      res.sendFile(path.resolve(__dirname, './../client', 'build', 'index.html'));
    });
  }  

  app.listen(port, () => {
    console.log(`Server OK, port ${port}`);
  });
};

main().catch(err => console.log(err));
