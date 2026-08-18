import dotevn from 'dotenv';
import app from "./app.js";
import { connectDatabase } from './config/database.js';

dotevn.config();

async function startServer() {
    try {
        await connectDatabase();


        const PORT = Number(process.env.PORT) || 5000;

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


