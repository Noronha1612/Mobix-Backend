import mongoose from 'mongoose';
import { config } from 'dotenv';

config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

export default async function connect() {
    const dbUrl = process.env.DB_URL;

    if ( !dbUrl ) throw new Error('Database Url Missing');

    await mongoose.connect(dbUrl as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}