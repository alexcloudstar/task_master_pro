import { constants, env } from 'config';
import { TSelectSprint } from 'db/schema';
import { describe, expect, test, beforeAll } from 'vitest';

describe('/api/sprint', () => {
	let response: Response;
	let body: { sprints: TSelectSprint[] };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/sprint', {
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
		expect(Array.isArray(body.sprints)).toBe(true);
	});

	test('Should return an array of sprints', () => {
		expect(body.sprints.length).toBeGreaterThan(0);
	});

	test('Should return an array of sprints object', () => {
		const keysOfSprint = Object.keys(body.sprints[0]);

		expect(keysOfSprint).toMatchObject(keysOfSprint);
	});
});

describe('/api/sprint/:id', () => {
	let response: Response;
	let body: { sprint: TSelectSprint };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/sprint/4', {
			headers: {
				Authorization: `Bearer ${env.TEST_TOKEN}`,
			},
		});
		body = await response.json();
	}, constants.BEFORE_ALL_TIMEOUT);

	test('Should have response status 200', () => {
		expect(response.status).toBe(200);
	});

	test('Should return an sprint typeof TSelectSprint', () => {
		const keysOfSprint = Object.keys(body.sprint);

		expect(keysOfSprint).toMatchObject(keysOfSprint);
	});
});
