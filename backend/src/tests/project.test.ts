import { constants, env } from 'config';
import { TSelectProject } from 'db/schema';
import { describe, expect, test, beforeAll } from 'vitest';

describe('/api/project', () => {
	let response: Response;
	let body: { projects: TSelectProject[] };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/project', {
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
		expect(Array.isArray(body.projects)).toBe(true);
	});

	test('Should return an array of projects', () => {
		expect(body.projects.length).toBeGreaterThan(0);
	});

	test('Should return an array of projects object', () => {
		const keysOfProject = Object.keys(body.projects[0]);

		expect(keysOfProject).toMatchObject(keysOfProject);
	});
});

describe('/api/project/:id', () => {
	let response: Response;
	let body: { project: TSelectProject };

	beforeAll(async () => {
		response = await fetch('http://localhost:8000/api/project/1', {
			headers: {
				Authorization: `Bearer ${env.TEST_TOKEN}`,
			},
		});
		body = await response.json();
	}, constants.BEFORE_ALL_TIMEOUT);

	test('Should have response status 200', () => {
		expect(response.status).toBe(200);
	});

	test('Should return an project typeof TSelectProject', () => {
		const keysOfProject = Object.keys(body.project);

		expect(keysOfProject).toMatchObject(keysOfProject);
	});
});
