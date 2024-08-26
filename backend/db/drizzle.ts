import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { env } from '../config';
import * as schema from './schema';

const client = new Client({
	host: env.DB_HOST,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	port: +env.DB_PORT!,
	database: env.DB_NAME,
	ssl: false,
});

const clientConnect = async () => {
	try {
		await client.connect();
	} catch (error: any) {
		console.error(error.stack);
	}
};

clientConnect();

export const db = drizzle(client, {
	schema,
});
