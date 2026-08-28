import mongoose from "mongoose";
import dotenv from 'dotenv';
import Tournament from "../models/tournament.js";
import tournaments from "./data.js";


dotenv.config();

const seedTournaments = async(req,res) =>{

    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connect to database");

        await Tournament.deleteMany();
        console.log("Existing tournament removed");

        await Tournament.insertMany(tournaments);
        console.log(`${tournaments.length} records inserted successfully `);    

        await mongoose.connection.close();
        console.log("Database connection closed");
        process.exit(0);
    }catch(err){

    }console.error("Tournament seeding failed:", error.message);

        await mongoose.connection.close();

        process.exit(1);
}

seedTournaments();