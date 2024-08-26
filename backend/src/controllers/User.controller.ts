import type { Request, Response } from 'express';
import { clerk } from '../';
import { db } from '../../db/drizzle';
import { user } from '../../db/schema';
import { eq } from 'drizzle-orm';

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

    if (!users.length) {
        return res.status(404).json({
            message: 'Users not found',
        });
    }

	return res.status(200).json({
		users,
	});
};

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

	const findedUser = await db.query.user.findFirst({
        where: eq(user.id, +id),
    });

    if (!findedUser) {
        return res.status(404).json({
            message: 'User not found',
        });
    }

	return res.status(200).json({
        user: findedUser,
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


