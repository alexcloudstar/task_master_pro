import { Application } from 'express';
import user from './User.route';
import project from './Project.route';

export default (app: Application): void => {
	app.use('/api/user', user);
	app.use('/api/project', project);
};
