import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Delete,
  Res,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  DepartmentServiceClient,
  DEPARTMENT_SERVICE_NAME,
} from './department.pb';

import {
  UserServiceClient,
  USER_SERVICE_NAME
} from '../user/user.pb';

import { HttpResponse } from 'src/interfaces/common';
import { CreateDepartmentHttpRequestDto } from 'src/department/dtos/create-department.dto';
import { UpdateDepartmentHttpRequestDto } from 'src/department/dtos/update-department.dto';

@Controller('departments')
export class DepartmentController implements OnModuleInit {
  private userService: UserServiceClient;
  private deparmentService: DepartmentServiceClient;
  private logger: Logger;

  @Inject(DEPARTMENT_SERVICE_NAME)
  private readonly departmentClient: ClientGrpc;

  @Inject(USER_SERVICE_NAME)
  private readonly userClient: ClientGrpc;

  public onModuleInit(): void {
    this.deparmentService = this.departmentClient.getService<DepartmentServiceClient>(DEPARTMENT_SERVICE_NAME);
    this.userService = this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    this.logger = new Logger('department');
  }

  @Post()
  private async createDepartment(@Body() body: CreateDepartmentHttpRequestDto, @Res() response): Promise<HttpResponse> {
    const department = await lastValueFrom(this.deparmentService.createDepartment(body));
    if (department.error?.some(e => e.includes('Existing Department'))) {
      return response
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send({
          error: department.error,
        });
    }
    if (department.error?.length) {
      console.error(department.error);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          data: department.data
        });
    }
    return response
      .status(HttpStatus.OK)
      .send({
        error: department.error,
      });
  }

  @Get(':id')
  private async getDepartmentById(@Param('id', ParseIntPipe) id: number, @Res() response): Promise<HttpResponse> {
    const departmentResponse = await lastValueFrom(this.deparmentService.getDepartmentById({ id }));
    if (departmentResponse.error?.some(e => e.includes('Department not found'))) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({
          error: ['Department not found']
        });
    }
    if (departmentResponse.error?.length) {
      this.logger.error(departmentResponse.error);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          error: ['Server error']
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
          id: departmentResponse.data.id,
          name: departmentResponse.data.name,
          users: users
        }
      });
  }

  @Get()
  private async getAllDepartments(@Res() response): Promise<HttpResponse> {
    const departmentsResponse = await lastValueFrom(this.deparmentService.getAllDepartments({}))
    if (departmentsResponse.data) {
      const userAssigns = await Promise.all(
        departmentsResponse.data.filter(d => d.departmentAssign?.length).map(async ({ id, departmentAssign }) => {
          return Promise.all(
            departmentAssign.map((assign) => lastValueFrom(this.userService.getUserById({ id: assign.userId })))
          ).then((response) => ({ id, users: response.map(ru => ru.data) }));
        }));
      //mapper for data aggregation
      const userAssignsMapper = userAssigns.reduce((prev, curr) => {
        prev[curr.id] = curr.users;
        return prev;
      }, {});

      return response
        .status(HttpStatus.OK)
        .send({
          data: departmentsResponse.data.map((department) => {
            if (department.departmentAssign?.length) {
              delete department.departmentAssign;
              return { ...department, users: userAssignsMapper[department.id] };
            }
            return { ...department, users: [] };
          })
        });
    }
    if (departmentsResponse.error?.length) {
      this.logger.error(departmentsResponse.error);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          error: ['Server error']
        });
    }

    return response
      .status(HttpStatus.OK)
      .send({
        data: []
      });
  }

  @Patch(':id')
  private async updateDepartmentById(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateDepartmentHttpRequestDto, @Res() response): Promise<HttpResponse> {
    const departmentUpdateResponse = await lastValueFrom(this.deparmentService.updateDepartmentById({ id: id, ...body }));
    if (departmentUpdateResponse.error?.some(e => e.includes('Department not found'))) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({
          error: ['Department not found']
        });
    }
    if (departmentUpdateResponse.error?.length) {
      this.logger.error(departmentUpdateResponse.error);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          error: ['Server error']
        });
    }
    return response
      .status(HttpStatus.OK)
      .send({
        data: departmentUpdateResponse.data
      });
  }

  @Delete(':id')
  private async deleteDepartmentById(@Param('id', ParseIntPipe) id: number, @Res() response): Promise<HttpResponse> {
    const departmentDeleteResponse = await lastValueFrom(this.deparmentService.deleteDepartmentById({ id }));
    if (departmentDeleteResponse.error?.some(e => e.includes('Department not found'))) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({
          error: ['Department not found']
        });
    }
    if (departmentDeleteResponse.error?.length) {
      this.logger.error(departmentDeleteResponse.error);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          error: ['Server error']
        });
    }
    return response
      .status(HttpStatus.NO_CONTENT)
      .send({});
  }
}
