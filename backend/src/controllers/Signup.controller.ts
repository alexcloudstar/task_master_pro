import type { Request, Response } from 'express';
import { clerk } from '../';
import { db } from '../../db/drizzle';
import { TInsertUser, user } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { jwtDecode } from 'jwt-decode';
import { clerkClient } from '@clerk/clerk-sdk-node';

export type TUserRegister = {
	password: string;
} & Pick<TInsertUser, 'first_name' | 'last_name' | 'email_address'>;

export type TUserUpdate = Omit<
	TInsertUser,
	'id' | 'clerk_id' | 'role' | 'created_at' | 'updated_at'
>;

const expiresInSeconds = 60 * 60 * 24 * 7;

// Only for testing purposes
export const signup = async (req: Request, res: Response) => {
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

		const createdUser = await db.insert(user).values({
			clerk_id: clerkUser.id,
			email_address: email_address ?? '',
			first_name: first_name ?? '',
			last_name: last_name ?? '',
			username: clerkUser.username ?? '',
			cover: '',
			avatar: '',
			role: 'user',
		});

		if (!createdUser) {
			return res.status(500).json({
				message: 'User not created',
			});
		}

		return res.status(201).json({ token });
	} catch (error: any) {
		return res.status(500).json({ message: error?.errors?.[0]?.message });
	}
};
