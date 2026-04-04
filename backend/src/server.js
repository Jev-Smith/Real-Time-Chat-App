import express from 'express'
import ENV from '../lib/env.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`));