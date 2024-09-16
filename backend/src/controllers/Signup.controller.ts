import type { Request, Response } from 'express';
import { db } from '../../db/drizzle';
import { TInsertUser, user } from '../../db/schema';

export type TUserRegister = Pick<TInsertUser, 'first_name' | 'last_name' | 'email_address' | 'clerk_id' | 'username'>

export type TUserUpdate = Omit<
	TInsertUser,
	'id' | 'clerk_id' | 'role' | 'created_at' | 'updated_at'
>;

// Only for testing purposes
export const signup = async (req: Request, res: Response) => {
	const { clerk_id, username, first_name, last_name, email_address }: TUserRegister = req.body;

	try {
		const createdUser = await db.insert(user).values({
			clerk_id,
			email_address: email_address ?? '',
			first_name: first_name ?? '',
			last_name: last_name ?? '',
			username,
			cover: '',
			avatar: '',
			role: 'user',
		});

		if (!createdUser) {
			return res.status(500).json({
				message: 'User not created',
			});
		}

        return res.status(201).json({
            message: 'User created successfully',
        });
	} catch (error: any) {
        console.log(error);
		return res.status(500).json({ message: error?.errors?.[0]?.message });
	}
};
