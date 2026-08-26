import express from 'express'
import { newsLetterController } from '../controller/newLetterController.js';

const router = express.Router();

router.post("/api/subscribe/newsletter", newsLetterController)


export default router;
