import express from 'express'
import {verifyAuth} from '../middlewares/auth.middleware.js'
import dashboard from '../controllers/dashboard.js'
import {register} from '../controllers/auth.controller.js'
const router = express.Router();

router.get('/dashboard', verifyAuth, dashboard);
router.post('/register', register)

export default router;