import { Application } from 'express';
import user from './Users.route';
import project from './Projects.route';
import sprint from './Sprints.route';
import task from './Tasks.route';
import { register } from '../controllers/Users.controller';

export default (app: Application): void => {
	// only used for testing
	app.post('/signup', register);
	app.use('/api/users', user);
	app.use('/api/projects', project);
	app.use('/api/sprints', sprint);
	app.use('/api/tasks', task);
};
