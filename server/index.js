import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import router from './routes/index.js';

let port = process.env.PORT || 5000;

const main = async () => {
  const app = express();
  
  app.use(express.json());
  app.use(cors());
  app.use('/api', router);

  app.listen(port, () => {
    console.log(`Server OK, port ${port}`);
  });
};

main().catch(err => console.log(err));
