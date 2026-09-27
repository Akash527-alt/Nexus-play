import express from 'express'
import errorMiddleware from './middleware/errorMiddleware.js';
import ErrorHandler from './utils/ErrorHandler.js';
import tournamentRoutes from './routes/tournamentRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import organizerRoutes from './routes/organizerRoutes.js'
import cors from 'cors'
import registrationRoutes from "./routes/registrationRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import participantRoutes from "./routes/participantRoutes.js";
import sponsorRoutes from './routes/sponsorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from "./routes/paymentRoutes.js";
import sponsorshipPaymentRoutes from "./routes/sponsorshipPaymentRoutes.js";
import prizeDistributionRoutes from "./routes/prizeDistributionRoutes.js";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174","https://nexus-play-client.onrender.com"],
        credentials: true,
    })
);

// middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('query parser', 'extended');

app.use("/api/v1/tournaments", tournamentRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/organizer", organizerRoutes);
app.use("/api/v1/sponsors", sponsorRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", registrationRoutes);
app.use("/api/v1/superadmin", superAdminRoutes);
app.use("/api/v1/participant", participantRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/sponsorship-payments", sponsorshipPaymentRoutes);
app.use("/api/v1/prize-distributions",prizeDistributionRoutes);



app.use(errorMiddleware);

export default app;
