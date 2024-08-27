import { env } from 'config';
import { TSelectUser } from 'db/schema';
import { describe, expect, test, beforeAll } from 'vitest';

const BEFORE_ALL_TIMEOUT = 30000; // 30 sec

describe('/api/user', () => {
	let response: Response;
	let body: { users: TSelectUser[] };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/user', {
			headers: {
				Authorization: `Bearer ${env.TEST_TOKEN}`,
			},
		});
		body = await response.json();
	}, BEFORE_ALL_TIMEOUT);

	test('Should have response status 200', () => {
		expect(response.status).toBe(200);
	});

	test('Should return an array of users', () => {
		expect(Array.isArray(body.users)).toBe(true);
	});
});

describe('/api/user/:id', () => {
	let response: Response;
	let body: { user: TSelectUser };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/user/1', {
			headers: {
				Authorization: `Bearer ${env.TEST_TOKEN}`,
			},
		});
		body = await response.json();
	}, BEFORE_ALL_TIMEOUT);

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
		response = await fetch('http://localhost:8000/api/user/me', {
			headers: {
				Authorization: `Bearer ${env.TEST_TOKEN}`,
			},
		});
		body = await response.json();
	}, BEFORE_ALL_TIMEOUT);

	test('Should have response status 200', () => {
		expect(response.status).toBe(200);
	});
});
