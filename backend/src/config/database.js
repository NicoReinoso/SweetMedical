import mongoose from 'mongoose';
import { config } from './config.js';

//CONEXION A LA BASE DE DATOS
export class MongoDBClient {
    static async connect() {
        try {
            console.log(`${config.mongoDBUri}/${config.mongoDB}?authSource=admin`);
            const conn = await mongoose.connect(`${config.mongoDBUri}/${config.mongoDB}?authSource=admin`);

            console.log(`MongoDB is connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
}