import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,

    db:{
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        passowrd: process.env.DB_PASSWORD
    }
};