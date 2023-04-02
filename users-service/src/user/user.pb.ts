/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

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

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;

  getUserById(request: GetUserByIdRequest): Observable<GetUserByIdResponse>;

  updateUserById(request: UpdateUserByIdRequest): Observable<UpdateUserByIdResponse>;

  deleteUserById(request: DeleteUserByIdRequest): Observable<DeleteUserByIdResponse>;

  getAllUsersByDepartment(request: GetAllUsersByDepartmentRequest): Observable<GetAllUsersByDepartmentResponse>;
}

export interface UserServiceController {
  createUser(
    request: CreateUserRequest,
  ): Promise<CreateUserResponse> | Observable<CreateUserResponse> | CreateUserResponse;

  getUserById(
    request: GetUserByIdRequest,
  ): Promise<GetUserByIdResponse> | Observable<GetUserByIdResponse> | GetUserByIdResponse;

  updateUserById(
    request: UpdateUserByIdRequest,
  ): Promise<UpdateUserByIdResponse> | Observable<UpdateUserByIdResponse> | UpdateUserByIdResponse;

  deleteUserById(
    request: DeleteUserByIdRequest,
  ): Promise<DeleteUserByIdResponse> | Observable<DeleteUserByIdResponse> | DeleteUserByIdResponse;

  getAllUsersByDepartment(
    request: GetAllUsersByDepartmentRequest,
  ):
    | Promise<GetAllUsersByDepartmentResponse>
    | Observable<GetAllUsersByDepartmentResponse>
    | GetAllUsersByDepartmentResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createUser",
      "getUserById",
      "updateUserById",
      "deleteUserById",
      "getAllUsersByDepartment",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
