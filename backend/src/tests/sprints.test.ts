import { describe, it, afterEach, beforeEach, vi, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import {
	createSprint,
	getSprints,
	getSprint,
	updateSprint,
	deleteSprint,
} from '../controllers/Sprints.controller';
import { db } from '../../db/drizzle';
import { TSelectSprint, TInsertSprint } from '../../db/schema';
import { jwtDecode } from 'jwt-decode';

vi.mock('../../db/drizzle', () => ({
	db: {
		query: {
			sprint: {
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
			where: vi.fn().mockReturnThis(),
			set: vi.fn().mockReturnThis(),
			returning: vi.fn(),
		}),
		delete: vi.fn().mockReturnValue({
			where: vi.fn().mockReturnThis(),
		}),
	},
}));

vi.mock('jwt-decode', async importOriginal => {
	const jwtDecode = (await importOriginal()) satisfies object;

	return {
		...jwtDecode,
		jwtDecode: vi.fn(),
	};
});

const app = express();
app.use(express.json());
app.get('/sprints', getSprints);
app.get('/sprints/:id', getSprint);
app.post('/sprints', createSprint);
app.put('/sprints/:id', updateSprint);
app.delete('/sprints/:id', deleteSprint);

const mockDate = new Date(2024, 11, 29);

describe('[GET] /sprints', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.setSystemTime(mockDate);
	});

	it('should return 200 and sprints', async () => {
		const mockSprints = [
			{
				id: 1,
				title: 'Sprint 1',
				assigned_to_id: 1,
				color: '#000',
				status: 'active',
				deadline: mockDate,
				project_id: 1,
				created_at: mockDate,
				updated_at: mockDate,
			},
			{
				id: 2,
				title: 'Sprint 2',
				assigned_to_id: 1,
				color: '#000',
				status: 'active',
				deadline: mockDate,
				project_id: 1,
				created_at: mockDate,
				updated_at: mockDate,
			},
		];

		(db.query.sprint.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockSprints,
		);

		const response = await request(app).get('/sprints');

		const expectedSprints = mockSprints.map(sprint => ({
			...sprint,
			deadline: mockDate.toISOString(),
			created_at: mockDate.toISOString(),
			updated_at: mockDate.toISOString(),
		}));

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ sprints: expectedSprints });
	});

	it('should return 404 when no sprints are found', async () => {
		(db.query.sprint.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(
			[],
		);

		const response = await request(app).get('/sprints');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Sprints not found' });
	});

	it('should return 500 when an error occurs', async () => {
		(db.query.sprint.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error(),
		);

		const response = await request(app).get('/sprints');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[GET] /sprints/:id', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.setSystemTime(mockDate);
	});

	it('should return 200 and a sprint', async () => {
		const mockSprint = {
			id: 1,
			title: 'Sprint 1',
			assigned_to_id: 1,
			color: '#000',
			status: 'active',
			deadline: mockDate,
			project_id: 1,
			created_at: mockDate,
			updated_at: mockDate,
		};

		(db.query.sprint.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockSprint,
		);

		const response = await request(app).get('/sprints/1');

		const expectedSprint = {
			...mockSprint,
			deadline: mockDate.toISOString(),
			created_at: mockDate.toISOString(),
			updated_at: mockDate.toISOString(),
		};

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ sprint: expectedSprint });
	});

	it('should return 404 when the sprint is not found', async () => {
		(db.query.sprint.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app).get('/sprints/1');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Sprint not found' });
	});

	it('should return 500 when an error occurs', async () => {
		(db.query.sprint.findFirst as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error(),
		);

		const response = await request(app).get('/sprints/1');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[POST] /sprints', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.setSystemTime(mockDate);
	});

	beforeEach(() => {
		const reqBody: TInsertSprint = {
			title: 'Sprint 1',
			assigned_to_id: 1,
			color: '#000',
			status: 'todo',
			created_by_id: 1,
			deadline: mockDate.toISOString(),
			project_id: 1,
		};

		const mockUser = { id: 'mock-user-id' };
		const createdSprint: TInsertSprint = {
			id: 1,
			...reqBody,
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
			returning: vi.fn().mockResolvedValue([createdSprint]),
		});
	});

	it('should return 201 and the created sprint', async () => {
		const createdSprint: TInsertSprint = {
			id: 1,
			title: 'Sprint 1',
			assigned_to_id: 1,
			color: '#000',
			status: 'todo',
			created_by_id: 1,
			deadline: mockDate.toISOString(),
			created_at: mockDate.toISOString() as any,
			updated_at: mockDate.toISOString() as any,
			project_id: 1,
		};

		const response = await request(app)
			.post('/sprints')
			.set('Authorization', 'Bearer valid.token')
			.send(createdSprint);

		expect(response.status).toBe(201);
		expect(response.body).toEqual({ sprint: createdSprint });
	});

	it('should return 401 if no token is provided', async () => {
		const response = await request(app).post('/sprints').send({});

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Unauthorized' });
	});

	it('should return 404 if user is not found', async () => {
		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: 'invalid-user-id',
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app)
			.post('/sprints')
			.set('Authorization', 'Bearer valid.token')
			.send({});

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'User not found' });
	});

	it('should return 500 when an error occurs', async () => {
		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: 'mock-user-id',
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
			id: 'mock-user-id',
		});

		(db.insert as ReturnType<typeof vi.fn>).mockRejectedValue(new Error());

		const response = await request(app)
			.post('/sprints')
			.set('Authorization', 'Bearer valid.token')
			.send({});

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[PUT] /sprints/:id', () => {
	const mockUser = { id: 1 };
	const mockSprint: TInsertSprint = {
		id: 1,
		title: 'Sprint 1',
		assigned_to_id: 1,
		color: '#000',
		status: 'todo',
		created_by_id: 1,
		deadline: mockDate.toISOString(),
		project_id: 1,
		created_at: mockDate.toISOString() as any,
		updated_at: mockDate.toISOString() as any,
	};

	afterEach(() => {
		vi.clearAllMocks();
		vi.setSystemTime(mockDate);
	});

	beforeEach(() => {
		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.id,
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);

		(db.query.sprint.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockSprint,
		);

		(db.update as ReturnType<typeof vi.fn>).mockReturnValue({
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue([
				{
					...mockSprint,
					title: 'Sprint 1 updated',
					color: '#FFF',
				},
			]),
		});
	});

	it('should return 200 and the updated sprint', async () => {
		const reqBody: TInsertSprint = {
			...mockSprint,
			title: 'Sprint 1 updated',
			color: '#FFF',
			deadline: mockDate.toISOString(),
			created_at: mockDate.toISOString() as any,
			updated_at: mockDate.toISOString() as any,
		};

		const response = await request(app)
			.put('/sprints/1')
			.set('Authorization', 'Bearer valid.token')
			.send(reqBody);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			sprint: {
				...reqBody,
			},
		});
	});

	it('should return 401 if no token is provided', async () => {
		const response = await request(app).put('/sprints/1').send({});

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Unauthorized' });
	});

	it('should return 403 if user is not the creator of the sprint', async () => {
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
			...mockUser,
			id: 2,
		});

		const response = await request(app)
			.put('/sprints/1')
			.set('Authorization', 'Bearer valid.token')
			.send({});

		expect(response.status).toBe(403);
		expect(response.body).toEqual({ message: 'Forbidden' });
	});

	it('should return 404 if sprint is not found', async () => {
		(db.query.sprint.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app)
			.put('/sprints/9999')
			.set('Authorization', 'Bearer valid.token')
			.send({});

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Sprint not found' });
	});

	it('should return 500 when an error occurs', async () => {
		(db.update as ReturnType<typeof vi.fn>).mockRejectedValue(new Error());

		const response = await request(app)
			.put('/sprints/1')
			.set('Authorization', 'Bearer valid.token')
			.send({});

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[DELETE] /sprints/:id', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should return 200 when the sprint is deleted', async () => {
		const mockSprint: TInsertSprint = {
			id: 1,
			created_by_id: 1,
			title: 'Sprint 1',
			project_id: 0,
			deadline: mockDate.toISOString(),
		};

		const mockUser = { id: 1, role: 'user', clerk_id: 'mock-clerk-id' };

		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.clerk_id,
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);

		(db.query.sprint.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockSprint,
		);

		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnThis(),
		});

		const response = await request(app)
			.delete('/sprints/1')
			.set('Authorization', 'Bearer valid.token');

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: 'Sprint deleted' });
	});

	it('should return 401 if no token is provided', async () => {
		const response = await request(app).delete('/sprints/1');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Unauthorized' });
	});

	it('should return 403 if user is not the creator of the sprint', async () => {
		const mockUser = { id: 1, role: 'user', clerk_id: 'mock-clerk-id' };
		const mockSprint: TInsertSprint = {
			id: 1,
			created_by_id: 2,
			title: 'Sprint 1',
			project_id: 0,
			deadline: mockDate.toISOString(),
		};

		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.clerk_id,
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);

		(db.query.sprint.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockSprint,
		);

		const response = await request(app)
			.delete('/sprints/1')
			.set('Authorization', 'Bearer valid.token');

		expect(response.status).toBe(403);
		expect(response.body).toEqual({ message: 'Forbidden' });
	});

	it('should return 404 if sprint is not found', async () => {
		(db.query.sprint.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app)
			.delete('/sprints/9999')
			.set('Authorization', 'Bearer valid.token');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Sprint not found' });
	});

	it('should return 500 when an error occurs', async () => {
		const mockSprint: TInsertSprint = {
			id: 1,
			created_by_id: 1,
			title: 'Sprint 1',
			project_id: 0,
			deadline: mockDate.toISOString(),
		};

		const mockUser = { id: 1, role: 'user', clerk_id: 'mock-clerk-id' };

		const spyDelete = vi.spyOn(db, 'delete');

		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.clerk_id,
		});

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);

		(db.query.sprint.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockSprint,
		);

		spyDelete.mockRejectedValue(new Error());

		const response = await request(app)
			.delete('/sprints/1')
			.set('Authorization', 'Bearer valid.token');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});
