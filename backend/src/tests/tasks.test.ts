import { constants, env } from 'config';
import { TSelectTask } from 'db/schema';
import { describe, expect, test, beforeAll } from 'vitest';

describe('/api/tasks', () => {
	let response: Response;
	let body: { tasks: TSelectTask[] };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/tasks', {
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
		expect(Array.isArray(body.tasks)).toBe(true);
	});

	test('Should return an array of tasks', () => {
		expect(body.tasks.length).toBeGreaterThan(0);
	});

	test('Should return an array of tasks object', () => {
		const keysOfTask = Object.keys(body.tasks[0]);

		expect(keysOfTask).toMatchObject(keysOfTask);
	});
});

describe('/api/task/:id', () => {
	let response: Response;
	let body: { task: TSelectTask };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/tasks/1', {
			headers: {
				Authorization: `Bearer ${env.TEST_TOKEN}`,
			},
		});
		body = await response.json();
	}, constants.BEFORE_ALL_TIMEOUT);

	test('Should have response status 200', () => {
		expect(response.status).toBe(200);
	});

	test('Should return an task typeof TSelectTask', () => {
		const keysOfTask = Object.keys(body.task);

		expect(keysOfTask).toMatchObject(keysOfTask);
	});
});
