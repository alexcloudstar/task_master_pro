import express from 'express';
import request from 'supertest';
import { db } from '../../db/drizzle';
import { jwtDecode } from 'jwt-decode';
import {
  getUsers,
  getUser,
  getProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/Users.controller';
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { TInsertUser, TSelectUser } from 'db/schema';

vi.mock('../../db/drizzle', () => ({
  db: {
    query: {
      user: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnThis(),
    }),
  },
}));

vi.mock('jwt-decode', async importOriginal => {
  const jwtDecode: object = await importOriginal();

  return {
    ...jwtDecode,
    jwtDecode: vi.fn(),
  };
});

const app = express();
app.use(express.json());
app.get('/users', getUsers);
app.get('/users/:id', getUser);
app.get('/users/profile', getProfile);
app.put('/users', updateProfile);
app.delete('/users/:id', deleteProfile);
app.post('/signup', vi.fn());

const mockDate = new Date(2022, 0, 1);

describe('[GET] /users', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.setSystemTime(mockDate);
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users: TSelectUser[] = [
        {
          id: 1,
          email_address: 'john@doe.com',
          role: 'user',
          username: 'john.doe',
          created_at: mockDate,
          updated_at: mockDate,
          clerk_id: 'john_clerk_id',
          avatar: 'john_avatar.jpg',
          cover: 'john_cover.jpg',
          first_name: 'John',
          last_name: 'Doe',
        },
        {
                    id: 2,
                    email_address: 'jane@doe.com',
                    role: 'admin',
                    username: 'jane.doe',
                    created_at: mockDate,
                    updated_at: mockDate,
                    clerk_id: 'jane_clerk_id',
                    avatar: 'jane_avatar.jpg',
                    cover: 'jane_cover.jpg',
                    first_name: 'Jane',
                    last_name: 'Doe',
        },
      ];

      (db.query.user.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(
        users
      );

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
    });
  });
});
