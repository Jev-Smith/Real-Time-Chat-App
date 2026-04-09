import express from 'express'
import {signup, login, logout} from '../controllers/auth.controller.js'

const router = express.Router();

router.get('/login', login)
      .get('/logout', logout);

router.post('/signup', signup)

export default router;