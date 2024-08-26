import { relations } from 'drizzle-orm';
import {
	integer,
	pgEnum,
	pgTable,
	serial,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

/*
- title: string
- description: string
- created_at: timestamp - default.now()
- updated_at: timestamp - default.now()
- task? (like subtask?): Array<>
- assets (but stored in S3)
- assigned to
- created/reported_by
- color: string
- status: enum(in progress, done, blocked, in review, etc) - check Jira
- deadline
*/

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
