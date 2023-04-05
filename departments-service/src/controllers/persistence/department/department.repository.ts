import {
  CreateDepartmentRequestDto,
  UpdateDepartmentRequestDto,
} from 'src/core/dtos/department/department.dto';
import { Department } from 'src/controllers/persistence/department/department.entity';
import { DataSource } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { IDepartmentRepository } from 'src/core/repositories/department.repository';

@Injectable()
export class DepartmentRepository implements IDepartmentRepository {
  constructor(@Inject('Datasource') private datasource: DataSource) {}

  async findOne(id: number): Promise<Department> {
    return await this.datasource
      .getRepository(Department)
      .findOne({ where: { id }, relations: ['departmentAssign'] });
  }

  async save(payload: CreateDepartmentRequestDto): Promise<Department> {
    const department = new Department();
    department.name = payload.name;
    return await this.datasource.getRepository(Department).save(department);
  }

  async find(): Promise<Department[]> {
    return await this.datasource
      .getRepository(Department)
      .find({ relations: ['departmentAssign'] });
  }

  async update(
    id: number,
    payload: UpdateDepartmentRequestDto,
  ): Promise<Department> {
    const department = await this.datasource
      .getRepository(Department)
      .findOne({ where: { id } });
    if (!department) {
      throw new Error('Department not found');
    }
    const updatedDepartment = { ...department, ...payload };
    return await this.datasource
      .getRepository(Department)
      .save(updatedDepartment);
  }

  async delete(id: number): Promise<Department> {
    const department = await this.datasource
      .getRepository(Department)
      .findOne({ where: { id } });
    if (!department) {
      throw new Error('Department not found');
    }
    return await this.datasource.getRepository(Department).remove(department);
  }
}
