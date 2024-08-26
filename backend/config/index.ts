import dotenv from 'dotenv';
dotenv.config();

export const env = {
	DB_HOST: process.env.DB_HOST,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
	DB_PORT: process.env.DB_PORT,
	CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
	CLERK_PUBLIC_KEY: process.env.CLERK_PUBLIC_KEY,
};
