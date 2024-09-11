import { TRoute } from './types';
import { v4 as uuid } from 'uuid';

export const routes: TRoute[] = [
  {
    id: uuid(),
    to: '/',
    label: 'Dashboard',
  },
];
