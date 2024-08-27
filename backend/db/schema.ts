import { relations } from 'drizzle-orm';
import {
	integer,
	pgEnum,
	pgTable,
	serial,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

export const eStatus = pgEnum('status', [
	'in_progress',
	'done',
	'blocked',
	'in_review',
	'todo',
]);
export const eRole = pgEnum('role', [
	'admin',
	'user',
	'manager',
	'developer',
	'qa',
	'designer',
	'product_owner',
	'scrum_master',
]);

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	clerk_id: varchar('clerk_id', { length: 255 }).notNull(),
	role: eRole('role'),
	avatar: varchar('avatar', { length: 255 }),
	cover: varchar('cover', { length: 255 }),
	email_address: varchar('email', { length: 255 }).notNull(),
	first_name: varchar('first_name', { length: 255 }).notNull(),
	last_name: varchar('last_name', { length: 255 }).notNull(),
	username: varchar('username', { length: 255 }).notNull(),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});

export const project = pgTable('project', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	description: varchar('description', { length: 255 }),
	color: varchar('color', { length: 255 }),
	created_by_id: integer('created_by_id').notNull(),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});

export const sprint = pgTable('sprint', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	assigned_to_id: integer('assigned_to_id').notNull(),
	created_by_id: integer('created_by_id').notNull(),
	color: varchar('color', { length: 255 }),
	status: eStatus('status'),
	project_id: integer('project_id').notNull(),
	deadline: timestamp('deadline'),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
});

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	description: varchar('description', { length: 255 }),
	status: eStatus('status'),
	project_id: integer('project_id').notNull(),
	created_by_id: integer('created_by_id').notNull(),
	assigned_to_id: integer('assigned_to_id'),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
	color: varchar('color', { length: 255 }),
});

export const userRelations = relations(user, ({ many }) => ({
	tasks: many(task),
	projects: many(project),
	sprint: many(sprint),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
	created_by: one(user, {
		fields: [project.created_by_id],
		references: [user.id],
	}),
	tasks: many(task),
}));

export const sprintRelations = relations(sprint, ({ one, many }) => ({
	created_by: one(user, {
		fields: [sprint.created_by_id],
		references: [user.id],
	}),
	assigned_to: one(user, {
		fields: [sprint.assigned_to_id],
		references: [user.id],
	}),
	project: one(project, {
		fields: [sprint.project_id],
		references: [project.id],
	}),
	tasks: many(task),
}));

export const taskRelations = relations(task, ({ one, many }) => ({
	created_by: one(user, {
		fields: [task.created_by_id],
		references: [user.id],
	}),
	assigned_to: one(user, {
		fields: [task.assigned_to_id],
		references: [user.id],
	}),
	project: one(project, {
		fields: [task.project_id],
		references: [project.id],
	}),
	subtasks: many(task),
}));

export type TSelectUser = typeof user.$inferSelect;
export type TInsertUser = typeof user.$inferInsert;
export type TSelectProject = typeof project.$inferSelect;
export type TInsertProject = typeof project.$inferInsert;
