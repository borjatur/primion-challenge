import { DepartmentAssignRequestDto } from 'src/core/dtos/department-assign/department-assign.dto';
import { DepartmentAssign } from 'src/controllers/persistence/department-assign/department-assign.entity';
import { Department } from 'src/controllers/persistence/department/department.entity';
import { DataSource } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { IDepartmentAssignRepository } from 'src/core/repositories/department-assign.repository';

@Injectable()
export class DepartmentAssignRepository implements IDepartmentAssignRepository {
  constructor(@Inject('Datasource') private datasource: DataSource) {}

  async save(payload: DepartmentAssignRequestDto): Promise<DepartmentAssign> {
    const department = await this.datasource
      .getRepository(Department)
      .findOne({ where: { id: payload.departmentId } });

    const departmentAssign = await this.datasource
      .getRepository(DepartmentAssign)
      .create({
        userId: payload.userId,
        department: {
          id: department.id,
        },
      });
    return await this.datasource
      .getRepository(DepartmentAssign)
      .save(departmentAssign);
  }

  async searchUpdate(
    payload: DepartmentAssignRequestDto,
  ): Promise<DepartmentAssign> {
    const department = await this.datasource
      .getRepository(Department)
      .findOne({ where: { id: payload.departmentId } });
    if (!department) {
      throw new Error(
        `Department with id ${payload.departmentId} does not exist`,
      );
    }
    const existingDepartmentAssign = await this.datasource
      .getRepository(DepartmentAssign)
      .findOne({ where: { userId: payload.userId } });
    if (existingDepartmentAssign) {
      await this.datasource
        .getRepository(DepartmentAssign)
        .remove(existingDepartmentAssign);
    }
    const newDepartmentAssign = await this.datasource
      .getRepository(DepartmentAssign)
      .create({
        userId: payload.userId,
        department: {
          id: department.id,
        },
      });
    return await this.datasource
      .getRepository(DepartmentAssign)
      .save(newDepartmentAssign);
  }

  async searchDelete(
    payload: DepartmentAssignRequestDto,
  ): Promise<DepartmentAssign> {
    const departmentAssign = await this.datasource
      .getRepository(DepartmentAssign)
      .findOneBy({
        userId: payload.userId,
      });
    return await this.datasource
      .getRepository(DepartmentAssign)
      .remove(departmentAssign);
  }
}
