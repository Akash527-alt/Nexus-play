import express from 'express'
import errorMiddleware from './middleware/errorMiddleware.js';
import ErrorHandler from './utils/ErrorHandler.js';
import tournamentRoutes from './routes/tournamentRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'

const app = express();

// middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('query parser', 'extended');



app.use("/api/v1/tournaments",tournamentRoutes);
app.use("/api/v1/auth",authRoutes);




app.use(errorMiddleware);

export default app;
