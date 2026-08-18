import express from 'express'
import errorMiddleware from './middleware/errorMiddleware.js';
import ErrorHandler from './utils/ErrorHandler.js';
import tournamentRoutes from './routes/tournamentRoutes.js'

const app = express();

// middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/tournaments",tournamentRoutes);

app.get("/",(req,res)=>{
    res.status(200).json(
        {
            success:true,
            message:"nexus-play is running in backend"
        }
    );

});

app.get("/hello",(req,res)=>{
    res.status(200).json(
        {
            success:true,
            message:"hello"
        }
    );

});

app.get("/test-error", (req, res, next) => {
    next(new ErrorHandler("This is a test error", 400));
});

app.use("/api/v1/tournaments",tournamentRoutes);


app.use(errorMiddleware);

export default app;
