import type { Request, Response } from 'express';
import { clerk } from '../';
import { db } from '../../db/drizzle';
import { user } from '../../db/schema';

export type TUserRegister = {
	first_name: string;
	last_name: string;
	email_address: string;
	password: string;
};

export type TUserLogin = {
	id: string;
} & Pick<TUserRegister, 'password'>;

const expiresInSeconds = 60 * 60 * 24 * 7;

export const getUsers = async (_: Request, res: Response) => {
	const users = await db.query.user.findMany();

	return res.status(200).json({
		users,
	});
};

// Only for testing purposes
export const register = async (req: Request, res: Response) => {
	const { first_name, last_name, email_address }: TUserRegister = req.body;

	try {
		const clerkUser = await clerk.users.createUser({
			...req.body,
			emailAddress: [email_address],
		});

		const { token } = await clerk.signInTokens.createSignInToken({
			userId: clerkUser.id,
			expiresInSeconds,
		});

		await db.insert(user).values({
			clerk_id: clerkUser.id,
			email: email_address,
			first_name: first_name ?? '',
			last_name: last_name ?? '',
			username: clerkUser.username ?? '',
			cover: '',
			avatar: '',
			role: 'user',
		});

		return res.status(201).json({ token });
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ message: error?.errors?.[0]?.message });
	}
};


