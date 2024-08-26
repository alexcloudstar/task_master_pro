import express, { Application } from 'express';
import routes from './routes';
import { env } from '../config';
import {
	ClerkExpressRequireAuth,
	createClerkClient,
} from '@clerk/clerk-sdk-node';
import { StrictAuthProp } from '@clerk/clerk-sdk-node';
import cors from 'cors';

const app: Application = express();
const port = process.env.PORT || 8000;

declare global {
	namespace Express {
		interface Request extends StrictAuthProp {}
	}
}

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
