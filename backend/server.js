import app from "./app.js";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";

//Handling Uncaught Error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server Shutdown due to Uncaught Error`);
    process.exit(1);
});

//Config 
dotenv.config({path: 'backend/config/config.env'});

databaseConnection();

//Server listining
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working at http://localhost:${process.env.PORT}`);
})

//Un-handled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server Shutdown due to unhandled promise rejection`);

    server.close(() => {
        process.exit(1);
    })
})