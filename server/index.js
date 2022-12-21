import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import router from './routes/index.js';

let port = process.env.PORT || 6000;

const main = async () => {
  const app = express();
  
  app.use(express.json());
  app.use(cors());
  app.use('/api', router);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./../client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, './../client', 'build', 'index.html'));
    });
  }  

  app.listen(port, () => {
    console.log(`Server OK, port ${port}`);
  });
};

main().catch(err => console.log(err));
