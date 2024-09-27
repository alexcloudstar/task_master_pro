export type TProject = {
  id: number;
  title: string;
  description: string;
  color: string;
  created_by_id: number;
  created_at: Date;
  updated_at: Date;
};

export type TInsertProject = {
    id?: TProject['id'];
} & Omit<TProject, 'id'>;
