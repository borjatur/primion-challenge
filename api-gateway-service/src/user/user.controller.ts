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
  Logger
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  USER_SERVICE_NAME,
  UserServiceClient
} from './user.pb';
import {
  DEPARTMENT_SERVICE_NAME,
  DepartmentServiceClient,
} from '../department/department.pb';
import { HttpResponse } from '../interfaces/common';
import { CreateUserHttpRequestDto } from 'src/user/dtos/create-user.dto';
import { UpdateUserHttpRequestDto } from 'src/user/dtos/update-user.dto';

@Controller('departments/:departmentId/users')
export class UserController implements OnModuleInit {
  private userService: UserServiceClient;
  private deparmentService: DepartmentServiceClient;
  private logger: Logger;

  @Inject(USER_SERVICE_NAME)
  private readonly userClient: ClientGrpc;

  @Inject(DEPARTMENT_SERVICE_NAME)
  private readonly departmentClient: ClientGrpc;

  public onModuleInit(): void {
    this.userService = this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    this.deparmentService = this.departmentClient.getService<DepartmentServiceClient>(DEPARTMENT_SERVICE_NAME);
    this.logger = new Logger('user');
  }

  @Post()
  private async createUser(@Param('departmentId', ParseIntPipe) departmentId: number, @Body() body: CreateUserHttpRequestDto, @Res() response): Promise<HttpResponse> {
    const departmentResponse = await lastValueFrom(this.deparmentService.getDepartmentById({ id: departmentId }));
    if (departmentResponse.error?.some(e => e.includes('Department not found')) || !departmentResponse.data) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({
          error: departmentResponse.error
        });
    }

    const userResponse = await lastValueFrom(this.userService.createUser({ departmentId, ...body }));
    if (userResponse.error?.length) {
      if (userResponse.error.some(e => e.includes('Existing User'))) {
        return response
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .send({
            eerror: userResponse.error
          });
      }
      this.logger.error(userResponse.error);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          error: ['Server error']
        });
    }

    return response
      .status(HttpStatus.CREATED)
      .send({
        data: userResponse.data
      });
  }

  @Get(':id')
  private async getUserById(@Param('departmentId', ParseIntPipe) departmentId: number, @Param('id', ParseIntPipe) id: number, @Res() response): Promise<HttpResponse> {
    const departmentResponse = await lastValueFrom(this.deparmentService.getDepartmentById({ id: departmentId }));
    if (departmentResponse?.error?.some(e => e.includes('Department not found')) || !departmentResponse.data) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({
          error: departmentResponse.error
        });
    }

    const userResponse = await lastValueFrom(this.userService.getUserById({ id }))
    if (userResponse.error?.length) {
      if (userResponse.error.some(e => e.includes('User not found'))) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .send({
            error: ['User not found']
          });
      }
      this.logger.error(userResponse.error);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          error: ['Server error']
        });
    }
    return response
      .status(HttpStatus.OK)
      .send({
        data: userResponse.data
      });
  }

  @Get()
  private async getAllUsersByDepartment(@Param('departmentId', ParseIntPipe) departmentId: number, @Res() response): Promise<HttpResponse> {
    const departmentResponse = await lastValueFrom(this.deparmentService.getDepartmentById({ id: departmentId }));
    if (departmentResponse?.error?.some(e => e.includes('Department not found')) || !departmentResponse.data) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({
          error: departmentResponse.error
        });
    }

    let users = [];
    if (departmentResponse.data?.departmentAssign?.length) {
      users = await Promise.all(
        departmentResponse.data?.departmentAssign?.
          map((assign) => lastValueFrom(this.userService.getUserById({ id: assign.userId }))
            .then(ur => ur.data))
      );
    }
    return response
      .status(HttpStatus.OK)
      .send({
        data: {
          department: departmentResponse.data.name,
          users: users
        }
      });
  }

  @Patch(':id')
  private async updateUserById(@Param('departmentId', ParseIntPipe) departmentId: number, @Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserHttpRequestDto, @Res() response): Promise<HttpResponse> {
    const departmentResponse = await lastValueFrom(this.deparmentService.getDepartmentById({ id: departmentId }));
    if (departmentResponse?.error?.some(e => e.includes('Department not found')) || !departmentResponse.data) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({
          error: departmentResponse.error
        });
    }

    if (!departmentResponse.data?.departmentAssign?.some(({ userId }) => userId === id)) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({
          error: [`User ${id} does not belong to Department ${departmentResponse.data.name}`]
        });
    }

    if (body.departmentId) {
      const destinationDepartmentResponse = await lastValueFrom(this.deparmentService.getDepartmentById({ id: body.departmentId }));
      if (destinationDepartmentResponse?.error?.some(e => e.includes('Department not found')) || !destinationDepartmentResponse.data) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .send({
            error: ['Destination department not found']
          });
      }
    }

    const userUpdateResponse = await lastValueFrom(this.userService.updateUserById({ id, ...body }));
    if (userUpdateResponse.error?.length) {
      this.logger.error(userUpdateResponse.error)
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          error: ['Server Error']
        });
    }
    return response
      .status(HttpStatus.OK)
      .send({
        data: userUpdateResponse.data
      });
  }

  @Delete(':id')
  private async deleteUserById(@Param('departmentId', ParseIntPipe) departmentId: number, @Param('id', ParseIntPipe) id: number, @Res() response): Promise<HttpResponse> {
    const departmentResponse = await lastValueFrom(this.deparmentService.getDepartmentById({ id: departmentId }));
    if (departmentResponse?.error?.some(e => e.includes('Department not found')) || !departmentResponse.data) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({
          data: departmentResponse.error
        });
    }

    if (!departmentResponse.data?.departmentAssign?.some(({ userId }) => userId === id)) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({
          error: [`User ${id} does not belong to Department ${departmentResponse.data.name}`]
        });
    }

    const deleteUserResponse = await lastValueFrom(this.userService.deleteUserById({ id }));
    if (deleteUserResponse.error?.length) {
      this.logger.error(deleteUserResponse.error);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          error: ['Server Error']
        });
    }

    return response
      .status(HttpStatus.NO_CONTENT)
      .send({})
  }
}
