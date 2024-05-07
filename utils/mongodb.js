import mongoose from "mongoose";

let isConnected = false;
export const connectToDatabase = async () => {

    if (isConnected) {
        console.log('=> using existing database connection');
        return;
    }

    console.log('=> using new database connection');

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = db.connections[0].readyState;
        console.log("=> Database connected");
    } catch (error) {
        console.error(`Unable to connect to database: ${error}`);
    }

}