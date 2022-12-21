import express from 'express';
import { ScreenshotController } from '../controllers/index.js';
import { uploadFile } from '../utils/saveScreenshot.js';

const router = express.Router();

router.post('/', uploadFile().single('screenshot'), ScreenshotController.convertToText);

export default router;