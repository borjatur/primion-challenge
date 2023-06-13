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
  Logger,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE_NAME } from 'src/controllers/interfaces/user';
import { DEPARTMENT_SERVICE_NAME } from 'src/controllers/interfaces/department';

import { UserServiceClient } from 'src/core/interfaces/user/service.interface';
import { DepartmentServiceClient } from 'src/core/interfaces/department/service.interface';
import { HttpResponse } from 'src/controllers/interfaces/common';
import {
  CreateDepartmentRequestDto,
  UpdateDepartmentRequestDto,
} from 'src/core/dtos/department.dto';
import { DepartmentUseCases } from 'src/core/use-cases/department';

@Controller('departments')
export class DepartmentController implements OnModuleInit {
  private userService: UserServiceClient;
  private deparmentService: DepartmentServiceClient;
  private departmentUseCases: DepartmentUseCases;
  private logger: Logger;

  @Inject(DEPARTMENT_SERVICE_NAME)
  private readonly departmentClient: ClientGrpc;

  @Inject(USER_SERVICE_NAME)
  private readonly userClient: ClientGrpc;

  public onModuleInit(): void {
    this.deparmentService =
      this.departmentClient.getService<DepartmentServiceClient>(
        DEPARTMENT_SERVICE_NAME,
      );
    this.userService =
      this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    this.departmentUseCases = new DepartmentUseCases(
      this.deparmentService,
      this.userService,
    );
    this.logger = new Logger('department');
  }

  @Post()
  private async createDepartment(
    @Body() body: CreateDepartmentRequestDto,
    @Res() response,
  ): Promise<HttpResponse> {
    try {
      const department = await this.departmentUseCases.createDepartment(body);
      return response.status(HttpStatus.OK).send({
        data: department,
      });
    } catch (err) {
      if (err.message.includes('Department already exists')) {
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
  private async getDepartmentById(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ): Promise<HttpResponse> {
    try {
      const department = await this.departmentUseCases.getDepartmentById(id);
      return response.status(HttpStatus.OK).send({
        data: department,
      });
    } catch (err) {
      if (err.message.includes('Department not found')) {
        return response.status(HttpStatus.NOT_FOUND).send({
          error: ['Department not found'],
        });
      }
      this.logger.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: ['Server error'],
      });
    }
  }

  @Get()
  private async getAllDepartments(@Res() response): Promise<HttpResponse> {
    try {
      const departments = await this.departmentUseCases.getAllDepartments();
      return response.status(HttpStatus.OK).send({
        data: departments,
      });
    } catch (err) {
      this.logger.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: ['Server error'],
      });
    }
  }

  @Patch(':id')
  private async updateDepartmentById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDepartmentRequestDto,
    @Res() response,
  ): Promise<HttpResponse> {
    try {
      const department = await this.departmentUseCases.updateDepartmentById(
        id,
        body,
      );
      return response.status(HttpStatus.OK).send({
        data: department,
      });
    } catch (err) {
      if (err.message.includes('Department not found')) {
        return response.status(HttpStatus.NOT_FOUND).send({
          error: ['Department not found'],
        });
      }
      this.logger.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: ['Server error'],
      });
    }
  }

  @Delete(':id')
  private async deleteDepartmentById(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ): Promise<HttpResponse> {
    try {
      await this.departmentUseCases.deleteDepartmentById(id);
      return response.status(HttpStatus.NO_CONTENT).send({});
    } catch (err) {
      if (err.message.includes('Department not found')) {
        return response.status(HttpStatus.NOT_FOUND).send({
          error: ['Department not found'],
        });
      }
      this.logger.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: ['Server error'],
      });
    }
  }
}
