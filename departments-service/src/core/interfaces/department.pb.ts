/* eslint-disable */
export interface Empty {
}

export interface DepartmentAssignData {
  id: number;
  userId: number;
}

export interface DepartmentData {
  id: number;
  name: string;
  departmentAssign: DepartmentAssignData[];
}

export interface CreateDepartmentRequest {
  name: string;
}

export interface CreateDepartmentResponse {
  error: string[];
  data: DepartmentData | undefined;
}

export interface GetDepartmentByIdRequest {
  id: number;
}

export interface GetDepartmentByIdResponse {
  error: string[];
  data: DepartmentData | undefined;
}

export interface UpdateDepartmentByIdRequest {
  id: number;
  name?: string | undefined;
}

export interface UpdateDepartmentByIdResponse {
  error: string[];
  data: DepartmentData | undefined;
}

export interface DeleteDepartmentByIdRequest {
  id: number;
}

export interface DeleteDepartmentByIdResponse {
  error: string[];
}

export interface GetAllDepartmentsResponse {
  error: string[];
  data: DepartmentData[];
}