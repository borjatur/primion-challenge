import { DepartmentAssign } from "src/entities/department-assign.entity"

export interface DepartmentAssignRequest {
  userId: number,
  departmentId: number
}

export interface DepartmentAssignResponse {
  data: DepartmentAssign,
  error: string[]
}