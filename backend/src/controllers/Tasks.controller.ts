import { Request, Response } from 'express';

import { db } from '../../db/drizzle';
import { and, eq } from 'drizzle-orm';
import { task, TInsertTask, TSelectTask, user } from '../../db/schema';
import { jwtDecode } from 'jwt-decode';

export const getTasks = async (_: Request, res: Response) => {
	try {
		const tasks: TSelectTask[] = await db.query.task.findMany({
			with: {
				assigned_to: true,
			},
		});

		return res.status(200).json({
			tasks,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const getProjectTasks = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const tasks: TSelectTask[] = await db.query.task.findMany({
			with: {
				assigned_to: true,
			},
			where: eq(task.project_id, +id),
		});

		return res.status(200).json({
			tasks,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const getTask = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const findedTask: TSelectTask | undefined = await db.query.task.findFirst({
			where: eq(task.id, +id),
		});

		if (!findedTask) {
			return res.status(404).json({
				message: 'Task not found',
			});
		}

		return res.status(200).json({
			task: findedTask,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const createTask = async (req: Request, res: Response) => {
	const {
		title,
		description,
		status,
		assigned_to_id,
		color,
		project_id,
		order,
		time,
	}: TInsertTask = req.body;

	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({
				message: 'Unauthorized',
			});
		}

		const decoded = jwtDecode(token);

		const findedUser = await db.query.user.findFirst({
			where: eq(user.clerk_id, decoded.sub ?? ''),
		});

		if (!findedUser) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		const createdTask = await db
			.insert(task)
			.values({
				title,
				color,
				created_by_id: findedUser.id,
				assigned_to_id: assigned_to_id ?? findedUser.id,
				status,
				description,
				project_id: +project_id,
				order,
				time,
			})
			.returning();

		return res.status(201).json({
			task: createdTask[0],
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const updateTask = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, description, status, assigned_to_id, color }: TInsertTask =
		req.body;

	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({
				message: 'Unauthorized',
			});
		}

		const decoded = jwtDecode(token);

		const findedUser = await db.query.user.findFirst({
			where: eq(user.clerk_id, decoded.sub ?? ''),
		});

		if (!findedUser) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		const findedTask = await db.query.task.findFirst({
			where: eq(task.id, +id),
		});

		if (!findedTask) {
			return res.status(404).json({
				message: 'Task not found',
			});
		}

		const updatedTask = await db
			.update(task)
			.set({
				title,
				color,
				created_by_id: findedUser.id,
				assigned_to_id: assigned_to_id ?? findedUser.id,
				status,
				description,
				project_id: findedTask?.project_id,
			})
			.where(and(eq(task.id, +id), eq(task.created_by_id, findedUser.id)))
			.returning();

		if (!updatedTask.length) {
			return res.status(404).json({
				message: 'Task not found',
			});
		}

		return res.status(200).json({
			task: updatedTask[0],
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const deleteTask = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({
				message: 'Unauthorized',
			});
		}

		const decoded = jwtDecode(token);

		const findedUser = await db.query.user.findFirst({
			where: eq(user.clerk_id, decoded.sub ?? ''),
		});

		if (!findedUser) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		const findedTask = await db.query.task.findFirst({
			where: eq(task.id, +id),
		});

		if (!findedTask) {
			return res.status(404).json({
				message: 'Task not found',
			});
		}

		await db
			.delete(task)
			.where(and(eq(task.id, +id), eq(task.created_by_id, findedUser.id)));

		return res.status(200).json({
			message: 'Task deleted',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};
