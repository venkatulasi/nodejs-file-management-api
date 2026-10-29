import dotenv from 'dotenv';

dotenv.config();

export function requireEnv(name) {
    const value = process.env[name];

    if(!value || value.trim() === ""){
        throw new Error(`Missing required environment variable ${name}`);
    }
    
    return value;
}   

export const config = {
    port: process.env.PORT || 3000,

    db:{
        host: requireEnv("DB_HOST"),
        port: requireEnv("DB_PORT"),
        database: requireEnv("DB_NAME"),
        user: requireEnv("DB_USER"),
        password: requireEnv("DB_PASSWORD")
    }
};