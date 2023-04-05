import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateUserRequestDto,
  GetUserByIdRequestDto,
  UpdateUserByIdRequestDto,
  DeleteUserByIdRequestDto,
  GetAllUsersByDepartmentDto,
} from 'src/core/dtos/user.dto';
import {
  CreateUserResponse,
  GetUserByIdResponse,
  UpdateUserByIdResponse,
  DeleteUserByIdResponse,
  GetAllUsersByDepartmentResponse,
} from 'src/core/interfaces/user.pb';
import { UserService } from 'src/core/use-cases/user.service';
import { USER_SERVICE_NAME } from 'src/controllers/grpc/user.package';

@Controller()
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
  private createUser(
    payload: CreateUserRequestDto,
  ): Promise<CreateUserResponse> {
    return this.service.createUser(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserById')
  private getUserById(
    payload: GetUserByIdRequestDto,
  ): Promise<GetUserByIdResponse> {
    return this.service.getUserById(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetAllUsersByDeparment')
  private getAllUsers(
    payload: GetAllUsersByDepartmentDto,
  ): Promise<GetAllUsersByDepartmentResponse> {
    return this.service.getAllUsersByDeparment(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateUserById')
  private updateUserById(
    payload: UpdateUserByIdRequestDto,
  ): Promise<UpdateUserByIdResponse> {
    return this.service.updateUserById(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteUserById')
  private deleteUserById(
    payload: DeleteUserByIdRequestDto,
  ): Promise<DeleteUserByIdResponse> {
    return this.service.deleteUserById(payload);
  }
}
