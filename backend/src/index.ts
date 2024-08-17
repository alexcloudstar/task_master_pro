import express, { Response, Application } from 'express';

const app: Application = express();
const port = process.env.PORT || 8000;

app.get('/', (_, res: Response) => {
	res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
