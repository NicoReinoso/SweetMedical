import mongoose from 'mongoose';
import { config } from './config.js';

export class MongoDBClient {
    static async connect() {
        try {
            const conn = await mongoose.connect(config.mongoURI);
            console.log(`MongoDB is connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
}