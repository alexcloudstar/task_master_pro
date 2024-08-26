import type { Request, Response } from 'express';
import { clerk } from '../';
import { db } from '../../db/drizzle';
import { user } from 'db/schema';

export type TUserRegister = {
	firstName: string;
	lastName: string;
	emailAddress: string;
	password: string;
};

export type TUserLogin = {
	id: string;
} & Pick<TUserRegister, 'password'>;

const expiresInSeconds = 60 * 60 * 24 * 7;

export const getUsers = async (req: Request, res: Response) => {
	return res.status(200).json({ message: 'Hello World' });
};

export const register = async (req: Request, res: Response) => {
	const { emailAddress }: TUserRegister = req.body;

	try {
		const clerkUser = await clerk.users.createUser({
			...req.body,
			emailAddress: [emailAddress],
		});

		const { token } = await clerk.signInTokens.createSignInToken({
			userId: clerkUser.id,
			expiresInSeconds,
		});

		db.insert(user).values({
			clerk_id: clerkUser.id,
			role: 'user',
		});

		return res.status(201).json({ token });
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ message: error?.errors?.[0]?.message });
	}
};

export const login = async (req: Request, res: Response) => {
	const { id, password }: TUserLogin = req.body;

	try {
		const response = await clerk.users.verifyPassword({
			userId: id,
			password,
		});

		if (!response) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const token = await clerk.signInTokens.createSignInToken({
			userId: id,
			expiresInSeconds,
		});

		return res.status(201).json({
			token,
		});
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ message: error?.errors?.[0]?.message });
	}
};
