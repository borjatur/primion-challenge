import { Observable } from 'rxjs';

export interface CreateUserRequest {
  username: string;
  departmentId: number;
}

export interface CreateUserResponse {
  error: string[];
  data: UserData | undefined;
}

export interface GetUserByIdRequest {
  id: number;
}

export interface UserData {
  id: number;
  username: string;
  departmentId: number;
}

export interface GetUserByIdResponse {
  error: string[];
  data: UserData | undefined;
}

export interface UpdateUserByIdRequest {
  id: number;
  username?: string | undefined;
  departmentId?: number | undefined;
}

export interface UpdateUserByIdResponse {
  error: string[];
  data: UserData | undefined;
}

export interface DeleteUserByIdRequest {
  id: number;
}

export interface DeleteUserByIdResponse {
  error: string[];
}

export interface GetAllUsersByDepartmentRequest {
  departmentId: number;
}

export interface GetAllUsersByDepartmentResponse {
  error: string[];
  data: UserData[];
}

export interface UserServiceClient {
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;

  getUserById(request: GetUserByIdRequest): Observable<GetUserByIdResponse>;

  updateUserById(
    request: UpdateUserByIdRequest,
  ): Observable<UpdateUserByIdResponse>;

  deleteUserById(
    request: DeleteUserByIdRequest,
  ): Observable<DeleteUserByIdResponse>;

  getAllUsersByDepartment(
    request: GetAllUsersByDepartmentRequest,
  ): Observable<GetAllUsersByDepartmentResponse>;
}
