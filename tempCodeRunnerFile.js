import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser'; // Import cookie-parser library

config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(cookieParser()); // Use cookie-parser middleware

app.use('/ping', (req, res) => {
    res.send('pong');
});

// Routes
app.all('*', (req, res) => {
    res.status(404).send('OPPS 404 PAGE NOT FOUND');
});

export default app;
