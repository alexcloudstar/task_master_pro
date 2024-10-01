export type TProject = {
  id: number;
  title: string;
  description: string;
  color: string;
  created_by_id: number;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
};

export type TInsertProject = {
  id?: TProject['id'];
  created_by_id?: TProject['created_by_id'];
} & Omit<TProject, 'id' | 'created_by_id'>;
