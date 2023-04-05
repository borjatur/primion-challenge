import { DepartmentAssignData } from 'src/core/entities/department-assign.entity';

export interface DepartmentData {
  id: number;
  name: string;
  departmentAssign: DepartmentAssignData[];
}
