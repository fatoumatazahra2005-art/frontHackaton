export type Role = 'ROLE_ADMIN' | 'ROLE_PARTICIPANT' | 'ROLE_JURY';

export interface UserModel {
  id: number;
  username: string;
  role: Role;
  password?: string;
}
