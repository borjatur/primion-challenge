import { DepartmentAssignData } from 'src/core/entities/department-assign.entity';

export interface DepartmentAssignRequest {
  userId: number;
  departmentId: number;
}

export interface DepartmentAssignResponse {
  data: DepartmentAssignData;
  error: string[];
}
