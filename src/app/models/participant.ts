import { Team } from './team';

export interface Participant {

  id:number;

  username:string;

  password?:string;

  role:string;

  team?:Team | null;

}
