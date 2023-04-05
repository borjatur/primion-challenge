import { Inject } from '@nestjs/common';
import {
  CreateUserRequestDto,
  GetUserByIdRequestDto,
  UpdateUserRequestDto,
  GetAllUsersByDepartmentDto,
  DeleteUserByIdRequestDto,
} from 'src/core/dtos/user.dto';
import {
  CreateUserResponse,
  GetAllUsersByDepartmentResponse,
  GetUserByIdResponse,
  UpdateUserByIdResponse,
  DeleteUserByIdResponse,
} from 'src/core/interfaces/user.pb';

import { IUserRepository } from 'src/core/repositories/user.repo';
import { IPublisherRepository } from 'src/core/repositories/publisher.repo';
import { EventType } from 'src/core/entities/event.entity';

export class UserService {
  constructor(
    @Inject('IUserRepository') private repository: IUserRepository,
    @Inject('IPublisherRepository') private redisClient: IPublisherRepository,
  ) {}

  public async getUserById(
    payload: GetUserByIdRequestDto,
  ): Promise<GetUserByIdResponse> {
    const user = await this.repository.findOne(payload.id);
    if (!user) {
      return { data: null, error: ['User not found'] };
    }
    return { data: user, error: null };
  }

  public async createUser(
    payload: CreateUserRequestDto,
  ): Promise<CreateUserResponse> {
    try {
      const savedUser = await this.repository.save(payload);
      await this.redisClient.publish(
        EventType.ADD_USER,
        JSON.stringify({
          userId: savedUser.id,
          departmentId: savedUser.departmentId,
        }),
      );
      return { data: savedUser, error: null };
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        return {
          data: null,
          error: [`Existing User with name ${payload.username}`],
        };
      }
      return { data: null, error: [err.message] };
    }
  }

  public async getAllUsersByDeparment(
    payload: GetAllUsersByDepartmentDto,
  ): Promise<GetAllUsersByDepartmentResponse> {
    const users = await this.repository.findByDepartment(payload.departmentId);
    return { data: users, error: null };
  }

  public async updateUserById(
    payload: UpdateUserRequestDto,
  ): Promise<UpdateUserByIdResponse> {
    try {
      const updatedUser = await this.repository.update(payload);
      await this.redisClient.publish(
        EventType.EDIT_USER,
        JSON.stringify({
          userId: updatedUser.id,
          departmentId: updatedUser.departmentId,
        }),
      );
      return { data: updatedUser, error: null };
    } catch (err) {
      return { data: null, error: [err.message] };
    }
  }

  public async deleteUserById(
    payload: DeleteUserByIdRequestDto,
  ): Promise<DeleteUserByIdResponse> {
    try {
      const removeResult = await this.repository.delete(payload.id);
      await this.redisClient.publish(
        EventType.DELETE_USER,
        JSON.stringify({
          userId: payload.id,
          departmentId: removeResult.departmentId,
        }),
      );
      return { error: null };
    } catch (err) {
      return { error: [err.message] };
    }
  }
}
