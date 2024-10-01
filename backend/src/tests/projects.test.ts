import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import {
	createProject,
	deleteProject,
	getProject,
	getProjects,
	updateProject,
} from '../controllers/Projects.controller'; // Adjust the import path
import { db } from '../../db/drizzle'; // Adjust the path to where your db instance is
import { TSelectProject, TInsertProject } from '../../db/schema';
import { jwtDecode } from 'jwt-decode';

// Mock the Drizzle ORM's db.query.project.findMany method
vi.mock('../../db/drizzle', () => ({
	db: {
		query: {
			project: {
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
app.get('/projects', getProjects);
app.get('/projects/:id', getProject);
app.post('/projects', createProject);
app.put('/projects/:id', updateProject);
app.delete('/projects/:id', deleteProject);

const mockDate = new Date(2022, 0, 1);

describe('[GET] /projects', () => {
	afterEach(() => {
		vi.clearAllMocks(); // Clear mocks after each test to ensure a clean state
		vi.setSystemTime(mockDate);
	});

	it('should return 200 and a list of projects when projects exist', async () => {
		const mockProjects: TSelectProject[] = [
			{
				id: 1,
				description: 'Project 1',
				title: 'Project 1',
				color: 'red',
				created_by_id: 1,
				created_at: mockDate,
				updated_at: mockDate,
			},
			{
				id: 2,
				description: 'Project 2',
				title: 'Project 2',
				color: 'red',
				created_by_id: 2,
				created_at: mockDate,
				updated_at: mockDate,
			},
		];

		(db.query.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockProjects,
		);

		const response = await request(app).get('/projects');

		const expectedProjects = mockProjects.map(project => ({
			...project,
			created_at: project.created_at?.toISOString(),
			updated_at: project.updated_at?.toISOString(),
		}));

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ projects: expectedProjects });
	});

	it('should return empty array when no projects are found', async () => {
		(db.query.project.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(
			[],
		);

		const response = await request(app).get('/projects');

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ projects: [] });
	});

	it('should return 500 when there is an internal server error', async () => {
		(db.query.project.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error('Database Error'),
		);

		const response = await request(app).get('/projects');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[GET] /projects/:id', () => {
	afterEach(() => {
		vi.clearAllMocks(); // Clear mocks after each test to ensure a clean state
		vi.setSystemTime(mockDate);
	});

	it('should return 200 and a project when exist', async () => {
		const mockProject: TSelectProject = {
			id: 1,
			description: 'Project 1',
			title: 'Project 1',
			color: 'red',
			created_by_id: 1,
			created_at: mockDate,
			updated_at: mockDate,
		};

		(db.query.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockProject,
		);

		const response = await request(app).get('/projects/1');

		const expectedProject = {
			...mockProject,
			created_at: mockProject.created_at?.toISOString(),
			updated_at: mockProject.updated_at?.toISOString(),
		};

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ project: expectedProject });
	});

	it('should return 404 when is not found', async () => {
		(db.query.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app).get('/projects/999');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Project not found' });
	});

	it('should return 500 when there is an internal server error', async () => {
		(db.query.project.findFirst as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error('Database Error'),
		);

		const response = await request(app).get('/projects/1');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[POST] /projects', () => {
	afterEach(() => {
		vi.clearAllMocks(); // Clear mocks after each test
		vi.setSystemTime(mockDate);
	});

	beforeEach(() => {
		const reqBody: TInsertProject = {
			title: 'New Project',
			description: 'A description for the new project',
			color: '#FF5733',
			created_by_id: 1,
		};

		const mockUser = { id: 'mock-user-id' };
		const createdProject: TInsertProject = {
			id: 1,
			...reqBody,
			created_by_id: 1,
			created_at: mockDate,
			updated_at: mockDate,
		};

		// Mock jwtDecode function
		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.id,
		});
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		); // Mock user found
		(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({
			values: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue([createdProject]), // Mock created project
		});
	});

	it('should return 201 and the created project', async () => {
		const reqBody = {
			title: 'New Project',
			description: 'A description for the new project',
			color: '#FF5733',
		};

		const createdProject: TInsertProject = {
			id: 1,
			...reqBody,
			created_by_id: 1,
			updated_at: mockDate.toISOString() as any,
			created_at: mockDate.toISOString() as any,
		};

		const response = await request(app)
			.post('/projects')
			.set('Authorization', 'Bearer valid.token.here') // Set the authorization header
			.send(reqBody); // Send the request body

		expect(response.status).toBe(201);
		expect(response.body).toEqual({ project: createdProject });
	});

	it('should return 401 if no token is provided', async () => {
		const reqBody = {
			title: 'New Project',
			description: 'A description for the new project',
			color: '#FF5733',
		};

		const response = await request(app).post('/projects').send(reqBody); // Send the request body without authorization header

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Unauthorized' });
	});

	it('should return 404 if user is not found', async () => {
		const reqBody = {
			title: 'New Project',
			description: 'A description for the new project',
			color: '#FF5733',
		};

		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: 'invalid-user-id',
		});
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		); // Mock user not found

		const response = await request(app)
			.post('/projects')
			.set('Authorization', 'Bearer valid.token.here') // Set the authorization header
			.send(reqBody); // Send the request body

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'User not found' });
	});

	it('should return 500 on internal server error', async () => {
		const reqBody: TInsertProject = {
			title: 'New Project',
			description: 'A description for the new project',
			color: '#FF5733',
			created_by_id: 1,
		};

		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({ sub: 'user-id' });
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
			id: 'user-id',
		}); // Mock user found
		(db.insert as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error('Database Error'),
		); // Mock database error

		const response = await request(app)
			.post('/projects')
			.set('Authorization', 'Bearer valid.token.here') // Set the authorization header
			.send(reqBody); // Send the request body

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[PUT] /projects/:id', () => {
	const mockDate = new Date(2022, 0, 1);
	const mockUser = {
		id: 'mock-user-id',
		role: 'user',
		clerk_id: 'mock-sub-id',
	};
	const mockProject = {
		id: 1,
		title: 'Existing Project',
		description: 'An existing project description',
		color: '#FF5733',
		created_by_id: mockUser.id,
		created_at: mockDate.toISOString(),
		updated_at: mockDate,
	};

	afterEach(() => {
		vi.clearAllMocks(); // Clear mocks after each test
		vi.setSystemTime(mockDate);
	});

	beforeEach(() => {
		// Mock jwtDecode function
		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.clerk_id,
		});
		// Mock user and project in the database
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);
		(db.query.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockProject,
		);
		(db.update as ReturnType<typeof vi.fn>).mockReturnValue({
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue([
				{
					...mockProject,
					title: 'Updated Project',
					description: 'Updated description',
					color: '#00FF00',
					updated_at: mockDate.toISOString(),
				},
			]),
		});
	});

	it('should return 200 and the updated project when successful', async () => {
		const reqBody = {
			title: 'Updated Project',
			description: 'Updated description',
			color: '#00FF00',
		};

		const response = await request(app)
			.put('/projects/1')
			.set('Authorization', 'Bearer valid.token.here')
			.send(reqBody);

		expect(response.status).toBe(200);
		expect(response.body.project).toEqual({
			...mockProject,
			...reqBody,
			updated_at: mockDate.toISOString(),
		});
	});

	it('should return 401 if no token is provided', async () => {
		const reqBody = {
			title: 'Updated Project',
			description: 'Updated description',
			color: '#00FF00',
		};

		const response = await request(app).put('/projects/1').send(reqBody);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Unauthorized' });
	});

	it('should return 404 if the project is not found', async () => {
		(db.query.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const reqBody = {
			title: 'Updated Project',
			description: 'Updated description',
			color: '#00FF00',
		};

		const response = await request(app)
			.put('/projects/999')
			.set('Authorization', 'Bearer valid.token.here')
			.send(reqBody);

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Project not found' });
	});

	it('should return 500 on internal server error', async () => {
		(db.update as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error('Database Error'),
		);

		const reqBody = {
			title: 'Updated Project',
			description: 'Updated description',
			color: '#00FF00',
		};

		const response = await request(app)
			.put('/projects/1')
			.set('Authorization', 'Bearer valid.token.here')
			.send(reqBody);

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[DELETE] /projects/:id', () => {
	afterEach(() => {
		vi.clearAllMocks(); // Clear mocks after each test
	});

	it('should return 200 and delete the project successfully', async () => {
		const mockProject = { id: 1, created_by_id: 1 };
		const mockUser = { id: 1, role: 'user', clerk_id: 'mock-user-id' };

		// Mock jwtDecode to return the user's ID
		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.clerk_id,
		});

		// Mock project retrieval to find the project
		(db.query.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockProject,
		);

		// Mock user retrieval to find the user
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);

		// Mock the delete operation to resolve successfully
		(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
			where: vi.fn().mockReturnThis(),
		});

		// Perform the DELETE request
		const response = await request(app)
			.delete('/projects/1')
			.set('Authorization', 'Bearer valid.token.here');

		// Assert that the status is 200 and the correct message is returned
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: 'Project deleted' });
	});

	it('should return 401 if no token is provided', async () => {
		const response = await request(app).delete('/projects/1');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Unauthorized' });
	});

	it('should return 404 if user is not found', async () => {
		// Mock jwtDecode to return a valid clerk_id
		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: 'invalid-user-id',
		});

		// Mock user retrieval to not find the user
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app)
			.delete('/projects/1')
			.set('Authorization', 'Bearer valid.token.here');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'User not found' });
	});

	it('should return 404 if the project is not found', async () => {
		// Mock jwtDecode to return a valid clerk_id
		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: 'mock-user-id',
		});

		// Mock project retrieval to not find the project
		(db.query.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);
		// Mock user retrieval to find the user
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
			id: 1,
			role: 'user',
			clerk_id: 'mock-user-id',
		});

		const response = await request(app)
			.delete('/projects/999')
			.set('Authorization', 'Bearer valid.token.here');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Project not found' });
	});

	it('should return 500 on internal server error', async () => {
		const mockProject = { id: 1, created_by_id: 1 };
		const mockUser = { id: 1, role: 'user', clerk_id: 'mock-user-id' };
		const spyDelete = vi.spyOn(db, 'delete');

		// Mock jwtDecode to return the user's ID
		(jwtDecode as ReturnType<typeof vi.fn>).mockReturnValue({
			sub: mockUser.clerk_id,
		});

		// Mock project retrieval to find the project
		(db.query.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockProject,
		);

		// Mock user retrieval to find the user
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockUser,
		);

		// Simulate the internal server error during the delete operation
		spyDelete.mockRejectedValue(new Error('Database Error'));

		const response = await request(app)
			.delete('/projects/1')
			.set('Authorization', 'Bearer valid.token.here');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});
