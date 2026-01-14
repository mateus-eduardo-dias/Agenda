import express from 'express'
import {verifyAuth} from '../middlewares/auth.middleware.js'
import dashboard from '../controllers/dashboard.js'
const router = express.Router();

router.get('/dashboard', verifyAuth, dashboard);

export default router;