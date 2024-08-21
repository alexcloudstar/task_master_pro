import { TTask } from '../src/lib/types';

import { jsonb, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

{/*
- title: string - not null
- description: string
- created_at: timestamp - default now (start date)
- updated_at: timestamp - default now
- stories/tasks: Array<task>
- color: string
- status: enum(in progress, done, blocked, in review, etc) - Check Jira
- assets (but stored in S3)
- assigned to
- created/reported_by
- ?

    */}

export const EStatus = pgEnum('status', ['in_progress', 'done', 'blocked', 'in_review', 'closed']);


export const project = pgTable('project', {
	id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    description: varchar('description'),
    // Not sure if is the right way to store tasks we need an array
    tasks: jsonb("tasks").$type<TTask[]>().array(),
    color: varchar('color'),
    status: EStatus('status').notNull(),
    // TODO: Reference USER_ID
    assigned_to: varchar('assigned_to'),
    // TODO: Reference USER_ID
    created_by: varchar('created_by'),
    created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
