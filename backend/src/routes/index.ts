import { Application } from 'express';
import user from './User.route';
import project from './Project.route';
import { register } from '../controllers/User.controller';

export default (app: Application): void => {
    // only used for testing
    app.post('/signup', register);
	app.use('/api/user', user);
	app.use('/api/project', project);
};
