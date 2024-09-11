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

export const getUsers = async (_: Request, res: Response) => {
  const users = await db.query.user.findMany();

  if (!users.length) {
    return res.status(200).json({
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

  const { clerk_id, ...mappedUser } = findedUser;

  return res.status(200).json({
    user: mappedUser,
  });
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const decoded = jwtDecode(token);

    const findedUser = await db.query.user.findFirst({
      where: eq(user.clerk_id, decoded.sub ?? ''),
    });

    if (!findedUser) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { clerk_id, ...mappedUser } = findedUser;

    return res.status(200).json({
      user: mappedUser,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error?.errors?.[0]?.message,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const {
      avatar,
      cover,
      username,
      email_address,
      first_name,
      last_name,
    }: Omit<
      TInsertUser,
      'id' | 'clerk_id' | 'role' | 'created_at' | 'updated_at'
    > = req.body;

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const decoded = jwtDecode(token);

    const findedUser = await db.query.user.findFirst({
      where: eq(user.clerk_id, decoded.sub ?? ''),
    });

    if (!findedUser) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const updated_user = await db
      .update(user)
      .set({
        avatar,
        cover,
        username,
        email_address,
        first_name,
        last_name,
      })
      .where(eq(user.clerk_id, decoded.sub ?? ''))
      .returning();

    return res.status(200).json({
      user: updated_user,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error?.errors?.[0]?.message,
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const decoded = jwtDecode(token);

    const findedUser = await db.query.user.findFirst({
      where: eq(user.clerk_id, decoded.sub ?? ''),
    });

    if (!findedUser) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    await clerkClient.users.deleteUser(findedUser.clerk_id);

    await db.delete(user).where(eq(user.clerk_id, decoded.sub ?? ''));

    return res.status(204).json({
      message: 'User deleted',
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error?.errors?.[0]?.message,
    });
  }
};
