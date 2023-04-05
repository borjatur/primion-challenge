import { UserData } from 'src/core/interfaces/user/user-data.interface';

export interface UsersByDeparment {
  department: string;
  users: UserData[];
}
