import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const project = pgTable('project', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: varchar('description', { length: 255 }),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});
