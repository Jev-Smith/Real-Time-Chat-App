import express from 'express'

const router = express.Router();

router.get('/signup', (_, res) => res.send("Signup"))
      .get('/login', (_, res) => res.send("Login"))
      .get('/logout', (_, res) => res.send("Logout"));

export default router;