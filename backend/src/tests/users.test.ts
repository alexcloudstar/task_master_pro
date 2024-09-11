import express from 'express';
import request from 'supertest';
import { db } from '../../db/drizzle';
import { jwtDecode } from 'jwt-decode';
import {
	getUsers,
	getUser,
	getProfile,
	updateProfile,
	deleteProfile,
} from '../controllers/Users.controller';
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { TSelectUser } from 'db/schema';

vi.mock('../../db/drizzle', () => ({
	db: {
		query: {
			user: {
				findMany: vi.fn(),
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
app.get('/users', getUsers);
app.get('/users/:id', getUser);
app.get('/users/profile', getProfile);
app.put('/users', updateProfile);
app.delete('/users', deleteProfile);
app.post('/signup', vi.fn());

const mockDate = new Date(2022, 0, 1);

describe('[GET] /users', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.setSystemTime(mockDate);
	});

	it('should return 200 and a list of users when users exist', async () => {
		const users: TSelectUser[] = [
			{
				id: 1,
				email_address: 'john@doe.com',
				role: 'user',
				username: 'john.doe',
				clerk_id: 'john_clerk_id',
				avatar: 'john_avatar.jpg',
				cover: 'john_cover.jpg',
				first_name: 'John',
				last_name: 'Doe',
				created_at: mockDate,
				updated_at: mockDate,
			},
			{
				id: 2,
				email_address: 'jane@doe.com',
				role: 'admin',
				username: 'jane.doe',
				clerk_id: 'jane_clerk_id',
				avatar: 'jane_avatar.jpg',
				cover: 'jane_cover.jpg',
				first_name: 'Jane',
				last_name: 'Doe',
				created_at: mockDate,
				updated_at: mockDate,
			},
		];

		(db.query.user.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(
			users,
		);

		const response = await request(app).get('/users');

		const expectedUsers = users.map(user => ({
			...user,
			created_at: mockDate.toISOString(),
			updated_at: mockDate.toISOString(),
		}));

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ users: expectedUsers });
	});

	it('should return 404 when no users are found', async () => {
		(db.query.user.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

		const response = await request(app).get('/users');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'Users not found' });
	});

	it('should return 500 when an error occurs', async () => {
		(db.query.user.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error('Internal Server Error'),
		);

		const response = await request(app).get('/users');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[GET] /users/:id', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.setSystemTime(mockDate);
	});

	it('should return 200 and a user when user exists', async () => {
		const user: TSelectUser = {
			id: 1,
			email_address: 'john@doe.com',
			role: 'user',
			username: 'john.doe',
			clerk_id: 'john_clerk_id',
			avatar: 'john_avatar.jpg',
			cover: 'john_cover.jpg',
			first_name: 'John',
			last_name: 'Doe',
			created_at: mockDate,
			updated_at: mockDate,
		};

		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			user,
		);

		const response = await request(app).get('/users/1');

		const expectedUser = {
			...user,
			created_at: mockDate.toISOString(),
			updated_at: mockDate.toISOString(),
		};

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ user: expectedUser });
	});

	it('should return 404 when user is not found', async () => {
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app).get('/users/1');

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'User not found' });
	});

	it('should return 500 when an error occurs', async () => {
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error('Internal Server Error'),
		);

		const response = await request(app).get('/users/1');

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});

describe('[PUT] /users/:id', () => {
	const mockUser: TSelectUser = {
		id: 1,
		email_address: 'john@doe.com',
		role: 'user',
		username: 'john.doe',
		clerk_id: 'john_clerk_id',
		avatar: 'john_avatar.jpg',
		cover: 'john_cover.jpg',
		first_name: 'John',
		last_name: 'Doe',
		created_at: mockDate,
		updated_at: mockDate,
	};

	const modifiedValues = {
		email_address: 'johny@doe.com',
		avatar: 'johny_avatar.jpg',
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

		(db.update as ReturnType<typeof vi.fn>).mockReturnValue({
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue([
				{
					...mockUser,
					...modifiedValues,
					updated_at: mockDate.toISOString(),
				},
			]),
		});
	});

	it('should return 200 and the updated user when successful', async () => {
		const reqBody = {
			...modifiedValues,
		};

		const response = await request(app)
			.put('/users')
			.set('Authorization', 'Bearer token')
			.send(reqBody);

		expect(response.status).toBe(200);
		expect(response.body.user).toEqual({
			...mockUser,
			...reqBody,
			created_at: mockDate.toISOString(),
			updated_at: mockDate.toISOString(),
		});
	});

	it('should return 401 when no token is provided', async () => {
		const response = await request(app).put('/users').send(modifiedValues);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: 'Unauthorized' });
	});

	it('should return 404 when user is not found', async () => {
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(
			null,
		);

		const response = await request(app)
			.put('/users')
			.set('Authorization', 'Bearer token')
			.send(modifiedValues);

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: 'User not found' });
	});

	it('should return 500 when an error occurs', async () => {
		(db.query.user.findFirst as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error('Internal Server Error'),
		);

		const response = await request(app)
			.put('/users')
			.set('Authorization', 'Bearer token')
			.send(modifiedValues);

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: 'Internal Server Error' });
	});
});
