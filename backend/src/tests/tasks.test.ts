import express from 'express';
import request from 'supertest';
import { db } from '../../db/drizzle';
import { jwtDecode } from 'jwt-decode';
import {
	createTask,
	deleteTask,
	getTask,
	getTasks,
	updateTask,
} from '../controllers/Tasks.controller';
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { TInsertTask, TSelectTask } from 'db/schema';

vi.mock('../../db/drizzle', () => ({
	db: {
		query: {
			task: {
				findMany: vi.fn(),
				findFirst: vi.fn(),
			},
			user: {
				findFirst: vi.fn(),
			},
		},
		insert: vi.fn().mockReturnValue({
			values: vi.fn().mockReturnThis(),
			returning: vi.fn(),
		}),
		update: vi.fn().mockReturnValue({
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn(),
		}),
		delete: vi.fn().mockReturnValue({
			where: vi.fn().mockReturnThis(),
		}),
	},
}));

vi.mock('jwt-decode', async importOriginal => {
	const jwtDecode: object = await importOriginal();

	return {
		...jwtDecode,
		jwtDecode: vi.fn(),
	};
});

const app = express();
app.use(express.json());
app.get('/tasks', getTasks);
app.get('/tasks/:id', getTask);
app.post('/tasks', createTask);
app.put('/tasks/:id', updateTask);
app.delete('/tasks/:id', deleteTask);

const mockDate = new Date(2022, 0, 1);

describe('[GET] /tasks', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.setSystemTime(mockDate);
	});

	it('should return 200 and a list of tasks when projects exist', async () => {
		const mockTasks: TSelectTask[] = [
			{
				id: 0,
				title: 'Task 1',
				description: 'Description 1',
				status: 'todo',
				project_id: 0,
				created_by_id: 0,
				assigned_to_id: 0,
				created_at: mockDate,
				updated_at: mockDate,
				color: '#000000',
				order: 0,
				time: 3600,
			},
			{
				title: 'Task 2',
				id: 1,
				description: 'Description 2',
				status: 'todo',
				project_id: 0,
				created_by_id: 0,
				assigned_to_id: 0,
				created_at: mockDate,
				updated_at: mockDate,
				color: '#000000',
				order: 1,
				time: 7200,
			},
		];

		(db.query.task.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockTasks,
		);

		const response = await request(app).get('/tasks');
		const expectedTasks = mockTasks.map(task => ({
			...task,
			created_at: mockDate.toISOString(),
			updated_at: mockDate.toISOString(),
		}));

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ tasks: expectedTasks });
	});

	it('should return empty array when no tasks are found', async () => {
		(db.query.task.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

		const response = await request(app).get('/tasks');

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			tasks: [],
		});
	});

	it('should return 500 when an error occurs', async () => {
		(db.query.task.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error(),
		);

		const response = await request(app).get('/tasks');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[GET] /tasks/:id', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.setSystemTime(mockDate);
	});

	it('should return 200 and a task when it exists', async () => {
		const mockTask: TSelectTask = {
			id: 0,
			title: 'Task 1',
			description: 'Description 1',
			status: 'todo',
			project_id: 0,
			created_by_id: 0,
			assigned_to_id: 0,
			created_at: mockDate,
			updated_at: mockDate,
			color: '#000000',
			order: 0,
			time: 7200,
		};

		(db.query.task.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockTask,
		);

		const response = await request(app).get('/tasks/0');

		const expectedTask = {
			...mockTask,
			created_at: mockDate.toISOString(),
			updated_at: mockDate.toISOString(),
		};

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ task: expectedTask });
	});

	it('should return 404 when the task is not found', async () => {
		(db.query.task.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app).get('/tasks/0');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Task not found' });
	});

	it('should return 500 when an error occurs', async () => {
		(db.query.task.findFirst as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error(),
		);

		const response = await request(app).get('/tasks/0');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[POST] /tasks', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.setSystemTime(mockDate);
	});

	beforeEach(() => {
		const reqBody: TInsertTask = {
			title: 'Task 1',
			description: 'Description 1',
			status: 'todo',
			created_by_id: 0,
			project_id: 0,
			assigned_to_id: 0,
			color: '#000000',
			order: 0,
			time: 7200,
		};

		const mockUser = { id: 'mock-user-id' };

		const createdTask: TInsertTask = {
			...reqBody,
			created_by_id: 0,
			created_at: mockDate,
			updated_at: mockDate,
		};

		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.id,
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);

		(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({
			values: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue([createdTask]),
		});
	});

	it('should return 201 and the created task', async () => {
		const reqBody: TInsertTask = {
			title: 'Task 1',
			description: 'Description 1',
			status: 'todo',
			created_by_id: 0,
			project_id: 0,
			assigned_to_id: 0,
			color: '#000000',
			order: 0,
			time: 7200,
		};

		const createdTask = {
			...reqBody,
			created_at: mockDate.toISOString(),
			updated_at: mockDate.toISOString(),
		};

		const response = await request(app)
			.post('/tasks')
			.set('Authorization', 'Bearer valid.token.here')
			.send(reqBody);

		expect(response.status).toBe(201);
		expect(response.body).toEqual({ task: createdTask });
	});

	it('should return 401 when no token is provided', async () => {
		const response = await request(app).post('/tasks').send({
			title: 'Task 1',
			description: 'Description 1',
			status: 'todo',
		});

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Unauthorized' });
	});

	it('should return 404 when the user is not found', async () => {
		const reqBody: TInsertTask = {
			title: 'Task 1',
			description: 'Description 1',
			status: 'todo',
			created_by_id: 0,
			project_id: 0,
			assigned_to_id: 0,
			color: '#000000',
			order: 0,
			time: 7200,
		};

		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: 'invalid-user-id',
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app)
			.post('/tasks')
			.set('Authorization', 'Bearer valid.token.here')
			.send(reqBody);

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'User not found' });
	});

	it('should return 500 when an error occurs', async () => {
		const reqBody = {
			title: 'Task 1',
			description: 'Description 1',
			status: 'todo',
			created_by_id: 0,
			project_id: 0,
			assigned_to_id: 0,
			color: '#000000',
			order: 0,
		} satisfies TInsertTask;

		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: 'mock-user-id',
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
			id: 'mock-user-id',
		});

		(db.insert as ReturnType<typeof vi.fn>).mockRejectedValue(new Error());

		const response = await request(app)
			.post('/tasks')
			.set('Authorization', 'Bearer valid.token.here')
			.send(reqBody);

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[PUT] /tasks/:id', () => {
	const mockUser = {
		id: 0,
		role: 'user',
		clerk_id: 'mock-sub-id',
	};

	const mockTask: TSelectTask = {
		id: 0,
		title: 'Task 1',
		description: 'Description 1',
		status: 'todo',
		project_id: 0,
		created_by_id: 0,
		assigned_to_id: 0,
		created_at: mockDate.toISOString() as any,
		updated_at: mockDate.toISOString() as any,
		color: '#000000',
		order: 0,
		time: 7200,
	};

	afterEach(() => {
		vi.clearAllMocks();
		vi.setSystemTime(mockDate);
	});

	beforeEach(() => {
		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.clerk_id,
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);

		(db.query.task.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockTask,
		);

		(db.update as ReturnType<typeof vi.fn>).mockReturnValue({
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue([
				{
					...mockTask,
					title: 'Task 2',
					description: 'Description 2',
					color: '#FFFFFF',
					updated_at: mockDate.toISOString(),
				},
			]),
		});
	});

	it('should return 200 and the updated task when successful', async () => {
		const reqBody = {
			title: 'Task 2',
			description: 'Description 2',
			color: '#FFFFFF',
		};

		const response = await request(app)
			.put('/tasks/0')
			.set('Authorization', 'Bearer valid.token.here')
			.send(reqBody);

		expect(response.status).toBe(200);
		expect(response.body.task).toEqual({
			...mockTask,
			...reqBody,
			updated_at: mockDate.toISOString(),
		});
	});

	it('should return 401 if no token is provided', async () => {
		const reqBody = {
			title: 'Task 2',
			description: 'Description 2',
			color: '#FFFFFF',
		};

		const response = await request(app).put('/tasks/0').send(reqBody);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Unauthorized' });
	});

	it('should return 404 if the task is not found', async () => {
		(db.query.task.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const reqBody = {
			title: 'Task 2',
			description: 'Description 2',
			color: '#FFFFFF',
			created_by_id: 0,
		};

		const response = await request(app)
			.put('/tasks/0')
			.set('Authorization', 'Bearer valid.token.here')
			.send(reqBody);

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Task not found' });
	});

	it('should return 500 if an error occurs', async () => {
		(db.update as ReturnType<typeof vi.fn>).mockRejectedValue(new Error());

		const reqBody = {
			title: 'Task 2',
			description: 'Description 2',
			color: '#FFFFFF',
		};

		const response = await request(app)
			.put('/tasks/0')
			.set('Authorization', 'Bearer valid.token.here')
			.send(reqBody);

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[DELETE] /tasks/:id', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should return 200 and the deleted task when successful', async () => {
		const mockTask: TSelectTask = {
			id: 0,
			title: 'Task 1',
			description: 'Description 1',
			status: 'todo',
			project_id: 0,
			created_by_id: 0,
			assigned_to_id: 0,
			created_at: mockDate,
			updated_at: mockDate,
			color: '#000000',
			order: 0,
			time: 7200,
		};

		const mockUser = {
			id: 0,
			role: 'user',
			clerk_id: 'mock-sub-id',
		} satisfies object;

		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.clerk_id,
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);

		(db.query.task.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockTask,
		);

		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnThis(),
		});

		const response = await request(app)
			.delete('/tasks/0')
			.set('Authorization', 'Bearer valid.token.here');

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: 'Task deleted' });
	});

	it('should return 401 if no token is provided', async () => {
		const response = await request(app).delete('/tasks/0');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Unauthorized' });
	});

	it('should return 404 if the task is not found', async () => {
		(db.query.task.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app)
			.delete('/tasks/0')
			.set('Authorization', 'Bearer valid.token.here');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Task not found' });
	});

	it('should return 500 if an error occurs', async () => {
		const mockTask = { id: 0, created_by_id: 0 };
		const mockUser = { id: 0, role: 'user', clerk_id: 'mock-sub-id' };
		const spyDelete = vi.spyOn(db, 'delete');

		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.clerk_id,
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);

		(db.query.task.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockTask,
		);

		spyDelete.mockRejectedValue(new Error());

		const response = await request(app)
			.delete('/tasks/0')
			.set('Authorization', 'Bearer valid.token.here');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});
