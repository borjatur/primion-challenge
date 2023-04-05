import { Inject } from '@nestjs/common';
import {
  CreateDepartmentRequestDto,
  GetDepartmentByIdRequestDto,
  UpdateDepartmentRequestDto,
  DeleteDepartmentByIdRequestDto,
} from 'src/core/dtos/department/department.dto';
import {
  CreateDepartmentResponse,
  GetAllDepartmentsResponse,
  UpdateDepartmentByIdResponse,
  DeleteDepartmentByIdResponse,
  GetDepartmentByIdResponse,
} from 'src/core/interfaces/department.pb';

import { IDepartmentRepository } from 'src/core/repositories/department.repository';

export class DepartmentService {
  constructor(
    @Inject('IDepartmentRepository') private repository: IDepartmentRepository,
  ) {}

  public async getDepartmentById({
    id,
  }: GetDepartmentByIdRequestDto): Promise<GetDepartmentByIdResponse> {
    const department = await this.repository.findOne(id);

    if (!department) {
      return { data: null, error: ['Department not found'] };
    }

    return { data: department, error: null };
  }

  public async createDepartment(
    payload: CreateDepartmentRequestDto,
  ): Promise<CreateDepartmentResponse> {
    try {
      const department = await this.repository.save(payload);
      return { data: department, error: null };
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        return {
          data: null,
          error: [`Existing Department with name ${payload.name}`],
        };
      }
      return { data: null, error: [err.message] };
    }
  }

  public async getAllDepartments(): Promise<GetAllDepartmentsResponse> {
    try {
      const departments = await this.repository.find();
      return { data: departments, error: null };
    } catch (err) {
      return { data: null, error: [err.message] };
    }
  }

  public async updateDepartmentById(
    payload: UpdateDepartmentRequestDto,
  ): Promise<UpdateDepartmentByIdResponse> {
    try {
      const updatedDepartment = await this.repository.update(
        payload.id,
        payload,
      );
      return { data: updatedDepartment, error: null };
    } catch (err) {
      return { data: null, error: [err.message] };
    }
  }

  public async deleteDepartmentById(
    payload: DeleteDepartmentByIdRequestDto,
  ): Promise<DeleteDepartmentByIdResponse> {
    try {
      await this.repository.delete(payload.id);
      return { error: null };
    } catch (err) {
      return { error: [err.message] };
    }
  }
}
