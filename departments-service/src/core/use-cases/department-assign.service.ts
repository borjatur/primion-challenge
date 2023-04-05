import { Injectable, Inject } from '@nestjs/common';
import { DepartmentAssignRequestDto } from 'src/core/dtos/department-assign/department-assign.dto';
import { IDepartmentAssignRepository } from 'src/core/repositories/department-assign.repository';
import { DepartmentAssignResponse } from 'src/core/interfaces/department-assign';

@Injectable()
export class DepartmentAssignService {
  constructor(
    @Inject('IDepartmentAssignRepository')
    private repository: IDepartmentAssignRepository,
  ) {}

  public async createDepartmentAssign(
    payload: DepartmentAssignRequestDto,
  ): Promise<DepartmentAssignResponse> {
    try {
      const departmentAssign = await this.repository.save(payload);
      return { data: departmentAssign, error: null };
    } catch (err) {
      return { data: null, error: [err.message] };
    }
  }

  public async editDepartmentAssign(
    payload: DepartmentAssignRequestDto,
  ): Promise<DepartmentAssignResponse> {
    try {
      const departmentAssign = await this.repository.searchUpdate(payload);
      return { data: departmentAssign, error: null };
    } catch (err) {
      return { data: null, error: [err.message] };
    }
  }

  public async deleteDepartmentAssign(
    payload: DepartmentAssignRequestDto,
  ): Promise<DepartmentAssignResponse> {
    try {
      const departmentAssign = await this.repository.searchDelete(payload);
      return { data: departmentAssign, error: null };
    } catch (err) {
      return { data: null, error: [err.message] };
    }
  }
}
