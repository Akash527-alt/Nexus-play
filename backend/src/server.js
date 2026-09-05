import dotevn from 'dotenv';
import app from "./app.js";
import { connectDatabase } from './config/database.js';
import { startTournamentScheduler } from "./utils/tournamentScheduler.js";

dotevn.config();

const PORT = Number(process.env.PORT) || 5000;

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! Shutting down...");
    console.error(err.name, err.message);

    process.exit(1);
});

// console.log(undefinedVariable);

async function startServer() {
    try {
        await connectDatabase();

        process.on("unhandledRejection", (err) => {
            console.error("UNHANDLED REJECTION! Shutting down...");
            console.error(err.name, err.message);

            server.close(() => {
                process.exit(1);
            });
        });

        startTournamentScheduler();


        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    }
    catch (err) {
        console.error("Unable to start server:", err.message);

        process.exit(1);
    }
};

startServer();


