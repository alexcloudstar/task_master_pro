import { Application } from 'express';
import user from './Users.route';
import project from './Projects.route';
import task from './Tasks.route';
import asset from './Assets.route';
import { signup } from '../controllers/Signup.controller';

export default (app: Application): void => {
	// only used for testing
	app.post('/signup', signup);
	app.use('/api/users', user);
	app.use('/api/projects', project);
	app.use('/api/tasks', task);
	app.use('/api/assets', asset);
};
