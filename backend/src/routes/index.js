import express from 'express'
import {verifyAuth} from '../middlewares/auth.middleware.js'
import dashboard from '../controllers/dashboard.js'
const router = express.Router();

router.get('/dashboard', verifyAuth, dashboard);

router.post('/api/v1/form-test', (req, res) => {
    console.log(req.body)
    res.status(200).end()
})

export default router;