import { UserData } from 'src/core/interfaces/user/user-data.interface';

export interface DepartmentAssignData {
  id: number;
  userId: number;
}

export interface DepartmentData {
  id: number;
  name: string;
  users?: UserData[];
}
