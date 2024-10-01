import { Request, Response } from 'express';

import { db } from '../../db/drizzle';
import { and, eq } from 'drizzle-orm';
import { project, TInsertProject, TSelectProject, user } from '../../db/schema';
import { jwtDecode } from 'jwt-decode';

export const getProjects = async (_: Request, res: Response) => {
	try {
		const projects: TSelectProject[] = await db.query.project.findMany();

		return res.status(200).json({
			projects,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const getProject = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const findedProject: TSelectProject | undefined =
			await db.query.project.findFirst({
				where: eq(project.id, +id),
			});

		if (!findedProject) {
			return res.status(404).json({
				message: 'Project not found',
			});
		}

		return res.status(200).json({
			project: findedProject,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const createProject = async (req: Request, res: Response) => {
	const { title, description, color }: TInsertProject = req.body;

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

		const createdProject = await db
			.insert(project)
			.values({
				title,
				description,
				color,
				created_by_id: findedUser.id,
			})
			.returning();

		return res.status(201).json({
			project: createdProject[0],
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const updateProject = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, description, color }: TInsertProject = req.body;

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

		const findedProject = await db.query.project.findFirst({
			where: eq(project.id, +id),
		});

		if (!findedProject) {
			return res.status(404).json({
				message: 'Project not found',
			});
		}

		const updatedProject = await db
			.update(project)
			.set({
				title,
				description,
				color,
			})
			.where(and(eq(project.id, +id), eq(project.created_by_id, findedUser.id)))
			.returning();

		return res.status(200).json({
			project: updatedProject[0],
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

export const deleteProject = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({
				message: 'Unauthorized',
			});
		}

		const decoded = jwtDecode(token);

		const findedProject = await db.query.project.findFirst({
			where: eq(project.id, +id),
		});

		if (!findedProject) {
			return res.status(404).json({
				message: 'Project not found',
			});
		}

		const findedUser = await db.query.user.findFirst({
			where: eq(user.clerk_id, decoded.sub ?? ''),
		});

		if (!findedUser) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		await db
			.delete(project)
			.where(
				and(eq(project.id, +id), eq(project.created_by_id, findedUser.id)),
			);

		return res.status(200).json({
			message: 'Project deleted',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};
