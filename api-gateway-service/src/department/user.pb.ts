/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface CreateUserRequest {
  username: string;
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
}

export interface GetUserByIdResponse {
  error: string[];
  data: UserData | undefined;
}

export interface UpdateUserByIdRequest {
  user: UserData | undefined;
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

export interface Empty {
}

export interface GetAllUsersResponse {
  error: string[];
  data: UserData[];
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;

  getUserById(request: GetUserByIdRequest): Observable<GetUserByIdResponse>;

  updateUserById(request: UpdateUserByIdRequest): Observable<UpdateUserByIdResponse>;

  deleteUserById(request: DeleteUserByIdRequest): Observable<DeleteUserByIdResponse>;

  getAllUsers(request: Empty): Observable<GetAllUsersResponse>;
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

  getAllUsers(request: Empty): Promise<GetAllUsersResponse> | Observable<GetAllUsersResponse> | GetAllUsersResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createUser", "getUserById", "updateUserById", "deleteUserById", "getAllUsers"];
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
