import express from 'express';
import screenshotRouter from './screenshotRouter.js';

const router = express.Router();

router.use('/screenshot', screenshotRouter);

export default router;
