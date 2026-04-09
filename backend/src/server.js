import express from 'express'
import ENV from '../lib/env.js'
import path from 'path'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import connectDB from '../lib/db.js'

const app = express();
const __dirname = path.resolve();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(ENV.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get("/{*any}", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    })
}

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`));
    } catch (error) {
        console.error("Error while starting the server", error);
    }
}

startServer();