import mongoose, { mongo } from "mongoose";

let isConnected = false;
export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

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

        isConnected = true;
        
        console.log("=> Database connected");
    } catch (error) {
        console.error(`Unable to connect to database: ${error}`);
    }

}