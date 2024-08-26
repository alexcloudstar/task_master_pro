import { Application } from 'express';
import user from './User.route';

export default (app: Application): void => {
	app.use('/api/user', user);
};
