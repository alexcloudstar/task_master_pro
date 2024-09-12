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
	TEST_TOKEN: process.env.TEST_TOKEN,
};

export const constants = {
	BEFORE_ALL_TIMEOUT: 30000, // 30 sec
	port: process.env.PORT || 8000,
	origin: 'http://localhost:5173',
	optionsSuccessStatus: 200,
};
