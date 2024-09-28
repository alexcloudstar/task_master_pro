import dotenv from 'dotenv';
dotenv.config();

// TODO: Add zod for validation
export const env = {
	DB_HOST: process.env.DB_HOST,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
	DB_PORT: process.env.DB_PORT,
	CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
	CLERK_PUBLIC_KEY: process.env.CLERK_PUBLIC_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET: process.env.AWS_BUCKET,
};

export const constants = {
	BEFORE_ALL_TIMEOUT: 30000, // 30 sec
	port: process.env.PORT || 8000,
	origin: 'http://localhost:5173',
	optionsSuccessStatus: 200,
};

