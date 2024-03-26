import mongoose from "mongoose";

const databaseConnection = () => {
    mongoose.connect(process.env.MONGO_URL).then((data) =>{
        console.log(`mongodb connected with server ${data.connection.host}`);
    });
};

export default databaseConnection;