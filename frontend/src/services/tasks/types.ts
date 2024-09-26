import { TUser } from '../users/types';

export enum ETaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  IN_REVIEW = 'in_review',
  DONE = 'done',
}

export type TTask = {
  id: number;
  title: string;
  description: string;
  status: string;
  project_id: number;
  created_by_id: number;
  assigned_to_id: number;
  assigned_to: TUser;
  created_at: string;
  updated_at: string;
  color: string;
  order: number;
  time: number;
};
