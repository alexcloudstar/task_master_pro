import { FolderKanban, Home, ListTodo } from 'lucide-react';
import { TRoute } from './types';
import { v4 as uuid } from 'uuid';

export const routes: TRoute[] = [
  {
    id: uuid(),
    to: '/',
    label: 'Dashboard',
    Icon: Home,
  },
  {
    id: uuid(),
    to: '/projects',
    label: 'Projects',
    Icon: FolderKanban,
  },
  {
    id: uuid(),
    to: '/tasks',
    label: 'Tasks',
    Icon: ListTodo,
  },
];

export type TPayment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  something: string;
};

export const payments: TPayment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
    something: 'something',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
    something: 'something',
  },
];
