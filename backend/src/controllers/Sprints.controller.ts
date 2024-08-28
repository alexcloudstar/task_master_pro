import { Request, Response } from 'express';

import { db } from '../../db/drizzle';
import { and, eq } from 'drizzle-orm';
import { sprint, TInsertSprint, TSelectSprint, user } from '../../db/schema';
import { jwtDecode } from 'jwt-decode';

export const getSprints = async (_: Request, res: Response) => {
	try {
		const sprints: TSelectSprint[] = await db.query.sprint.findMany();

		if (!sprints.length) {
			return res.status(404).json({
				message: 'Sprints not found',
			});
		}

		return res.status(200).json({
			sprints,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const getSprint = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const findedSprint: TSelectSprint | undefined =
			await db.query.sprint.findFirst({
				where: eq(sprint.id, +id),
			});

		if (!findedSprint) {
			return res.status(404).json({
				message: 'Sprint not found',
			});
		}

		return res.status(200).json({
			sprint: findedSprint,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const createSprint = async (req: Request, res: Response) => {
	const {
		title,
		assigned_to_id,
		color,
		status,
		deadline,
		project_id,
	}: TInsertSprint = req.body;

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

		const createdSprint = await db
			.insert(sprint)
			.values({
				title,
				color,
				created_by_id: findedUser.id,
				assigned_to_id: assigned_to_id ?? findedUser.id,
				status,
				deadline,
				project_id: +project_id,
			})
			.returning();

		return res.status(201).json({
			sprint: createdSprint[0],
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const updateSprint = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, assigned_to_id, color, status, deadline }: TInsertSprint =
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

		const findedSprint = await db.query.sprint.findFirst({
			where: eq(sprint.id, +id),
		});

		if (
			findedUser.role !== 'admin' &&
			findedUser.id !== findedSprint?.created_by_id
		) {
			return res.status(403).json({
				message: 'Forbidden',
			});
		}

		const updatedSprint = await db
			.update(sprint)
			.set({
				title,
				color,
				created_by_id: findedUser.id,
				assigned_to_id: assigned_to_id ?? findedUser.id,
				status,
				deadline,
				project_id: findedSprint?.project_id,
			})
			.where(and(eq(sprint.id, +id), eq(sprint.created_by_id, findedUser.id)))
			.returning();

		if (!updatedSprint.length) {
			return res.status(404).json({
				message: 'Sprint not found',
			});
		}

		return res.status(200).json({
			sprint: updatedSprint[0],
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const deleteSprint = async (req: Request, res: Response) => {
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

		const findedSprint = await db.query.sprint.findFirst({
			where: eq(sprint.id, +id),
		});

		if (
			findedUser.role !== 'admin' &&
			findedUser.id !== findedSprint?.created_by_id
		) {
			return res.status(403).json({
				message: 'Forbidden',
			});
		}

		await db
			.delete(sprint)
			.where(and(eq(sprint.id, +id), eq(sprint.created_by_id, findedUser.id)));

		return res.status(200).json({
			message: 'Sprint deleted',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};
