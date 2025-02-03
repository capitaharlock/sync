import dotenv from 'dotenv'; 
dotenv.config();  // Load environment variables from .env file 

export const EnvVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
}
