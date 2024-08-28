import { constants, env } from 'config';
import { TSelectUser } from 'db/schema';
import { describe, expect, test, beforeAll } from 'vitest';

describe('/api/users', () => {
	let response: Response;
	let body: { users: TSelectUser[] };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/users', {
			headers: {
				Authorization: `Bearer ${env.TEST_TOKEN}`,
			},
		});
		body = await response.json();
	}, constants.BEFORE_ALL_TIMEOUT);

	test('Should have response status 200', () => {
		expect(response.status).toBe(200);
	});

	test('Should return an array of users', () => {
		expect(Array.isArray(body.users)).toBe(true);
	});

	test('Should return an array of projects', () => {
		expect(body.users.length).toBeGreaterThan(0);
	});

	test('Should return an array of users object', () => {
		const keysOfUser = Object.keys(body.users[0]);

		expect(keysOfUser).toMatchObject(keysOfUser);
	});
});

describe('/api/user/:id', () => {
	let response: Response;
	let body: { user: TSelectUser };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/users/1', {
			headers: {
				Authorization: `Bearer ${env.TEST_TOKEN}`,
			},
		});
		body = await response.json();
	}, constants.BEFORE_ALL_TIMEOUT);

	test('Should have response status 200', () => {
		expect(response.status).toBe(200);
	});

	test('Should return a user object', () => {
		expect(typeof body.user).toBe('object');
	});
});

describe('/api/user/me', () => {
	let response: Response;
	let body: { user: TSelectUser };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/users/me', {
			headers: {
				Authorization: `Bearer ${env.TEST_TOKEN}`,
			},
		});
		body = await response.json();
	}, constants.BEFORE_ALL_TIMEOUT);

	test('Should have response status 200', () => {
		expect(response.status).toBe(200);
	});
});
