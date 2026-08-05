import { Role, UserModel } from './user-model';

export interface TeamModel {
  id: number;
  name: string;
  create_by: UserModel;

}
