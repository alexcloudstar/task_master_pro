export enum ERole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  DEVELOPER = 'developer',
  QA = 'qa',
  DESIGNER = 'designer',
  PRODUCT_OWNER = 'product_owner',
  SCRUM_MASTER = 'scrum_master',
}

export type TUser = {
  id: number;
  clerk_id: string;
  role: string;
  avatar: string;
  cover: string;
  email_address: string;
  first_name: string;
  last_name: string;
  username: string;
  created_at: string;
  updated_at: string;
};
