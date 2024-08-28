import { Application } from 'express';
import user from './User.route';
import project from './Project.route';
import sprint from './Sprint.route';
import task from './Task.route';
import { register } from '../controllers/User.controller';

export default (app: Application): void => {
	// only used for testing
	app.post('/signup', register);
	app.use('/api/user', user);
	app.use('/api/project', project);
	app.use('/api/sprint', sprint);
	app.use('/api/task', task);
};
