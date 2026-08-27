import express from 'express'
import { newsLetterController } from '../controller/newLetterController.js';
import { contactController } from '../controller/contactController.js';

const router = express.Router();

router.post("/api/subscribe/newsletter", newsLetterController);
router.post("/api/contact", contactController);


export default router;
