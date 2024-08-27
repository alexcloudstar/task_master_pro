import express, { Application } from 'express';
import routes from './routes';
import { env, constants } from '../config';

import {
	ClerkExpressRequireAuth,
	createClerkClient,
} from '@clerk/clerk-sdk-node';
import { StrictAuthProp } from '@clerk/clerk-sdk-node';
import cors from 'cors';

const app: Application = express();

declare global {
	namespace Express {
		interface Request extends StrictAuthProp {}
	}
}

app.use(cors({
    origin: constants.origin,
    optionsSuccessStatus: constants.optionsSuccessStatus,
}));
app.use(express.json());

export const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

app.all('/api/*', ClerkExpressRequireAuth(), (_, __, next) => {
	next();
});

app.use((err: any, _: any, res: any, __: any) => {
	console.error(err.stack);
	res.status(401).send('Unauthenticated!');
});

routes(app);

app.listen(constants.port, () => {
	console.log(`Server is running at http://localhost:${constants.port}`);
});
