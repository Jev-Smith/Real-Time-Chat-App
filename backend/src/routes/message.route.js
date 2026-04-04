import express from 'express'

const router = express.Router();

router.get('/send', (_, res) => res.send('Sent messages'));

export default router;