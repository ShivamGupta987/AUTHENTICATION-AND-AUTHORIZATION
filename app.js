import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import paymentRoutes from './routes/payment.routes.js';
// import errorMiddleware from './middlewares/error.middleware.js'
config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow requests only from the specified frontend URL
    credentials: true
}));

app.use(cookieParser());
app.use(morgan('dev'));

app.use('/ping', (req, res) => {
    res.send('pong');
});

// Define middleware
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
};

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.all('*', (req, res) => {
    res.status(404).send('OPPS 404 PAGE NOT FOUND');
});

app.use(errorMiddleware);

export default app;
