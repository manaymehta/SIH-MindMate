import express from 'express';
import {signup, login, logout, checkAuth, updateUserSentiment, getUsers, getUserConfidence} from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.get("/check", protectRoute, checkAuth)

router.post('/users/:userId/sentiment', updateUserSentiment)

router.get('/users', protectRoute, getUsers);

router.get('/users/:userId/confidence', protectRoute, getUserConfidence);

export default router;