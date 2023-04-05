import {
  Controller,
  Inject,
  Post,
  Get,
  Patch,
  Delete,
  Res,
  OnModuleInit,
  Param,
  ParseIntPipe,
  HttpStatus,
  Body,
  Logger,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE_NAME } from 'src/controllers/interfaces/user';
import { DEPARTMENT_SERVICE_NAME } from 'src/controllers/interfaces/department';
import { HttpResponse } from 'src/controllers/interfaces/common';
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from 'src/core/dtos/user.dto';
import { UserServiceClient } from 'src/core/interfaces/user/service.interface';
import { DepartmentServiceClient } from 'src/core/interfaces/department/service.interface';

import { UserUseCases } from 'src/core/use-cases/user';

@Controller('departments/:departmentId/users')
export class UserController implements OnModuleInit {
  private userService: UserServiceClient;
  private departmentService: DepartmentServiceClient;
  private userUseCases: UserUseCases;
  private logger: Logger;

  @Inject(USER_SERVICE_NAME)
  private readonly userClient: ClientGrpc;

  @Inject(DEPARTMENT_SERVICE_NAME)
  private readonly departmentClient: ClientGrpc;

  public onModuleInit(): void {
    this.userService =
      this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    this.departmentService =
      this.departmentClient.getService<DepartmentServiceClient>(
        DEPARTMENT_SERVICE_NAME,
      );
    this.userUseCases = new UserUseCases(
      this.userService,
      this.departmentService,
    );
    this.logger = new Logger('user');
  }

  @Post()
  private async createUser(
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Body() body: CreateUserRequestDto,
    @Res() response,
  ): Promise<HttpResponse> {
    try {
      const createdUser = await this.userUseCases.createUser(
        body,
        departmentId,
      );
      return response.status(HttpStatus.CREATED).send({
        data: createdUser,
      });
    } catch (err) {
      if (err.message.includes('not found')) {
        return response.status(HttpStatus.NOT_FOUND).send({
          error: err.message,
        });
      }
      if (err.message.includes('User already exists')) {
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
          error: err.message,
        });
      }
      this.logger.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: ['Server error'],
      });
    }
  }

  @Get(':id')
  private async getUserById(
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ): Promise<HttpResponse> {
    try {
      const data = await this.userUseCases.getUserById(id, departmentId);
      return response.status(HttpStatus.OK).send({
        data,
      });
    } catch (err) {
      if (err.message.includes('not found')) {
        return response.status(HttpStatus.NOT_FOUND).send({
          error: err.message,
        });
      }
      this.logger.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: ['Server error'],
      });
    }
  }

  @Get()
  private async getAllUsersByDepartment(
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Res() response,
  ): Promise<HttpResponse> {
    try {
      const data = await this.userUseCases.getAllUsersByDepartment(
        departmentId,
      );
      return response.status(HttpStatus.OK).send({
        data,
      });
    } catch (err) {
      if (err.message.includes('not found')) {
        return response.status(HttpStatus.NOT_FOUND).send({
          error: err.message,
        });
      }
      this.logger.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: ['Server error'],
      });
    }
  }

  @Patch(':id')
  private async updateUserById(
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserRequestDto,
    @Res() response,
  ): Promise<HttpResponse> {
    try {
      const data = await this.userUseCases.updateUserById(
        id,
        departmentId,
        body,
      );
      return response.status(HttpStatus.OK).send({
        data,
      });
    } catch (err) {
      if (
        err.message.includes('not found') ||
        err.message.includes('does not belong')
      ) {
        return response.status(HttpStatus.NOT_FOUND).send({
          error: err.message,
        });
      }
      this.logger.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: ['Server error'],
      });
    }
  }

  @Delete(':id')
  private async deleteUserById(
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ): Promise<HttpResponse> {
    try {
      await this.userUseCases.deleteUserById(id, departmentId);
      return response.status(HttpStatus.NO_CONTENT).send({});
    } catch (err) {
      if (
        err.message.includes('not found') ||
        err.message.includes('does not belong to')
      ) {
        return response.status(HttpStatus.NOT_FOUND).send({
          error: err.message,
        });
      }
      this.logger.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: ['Server error'],
      });
    }
  }
}
