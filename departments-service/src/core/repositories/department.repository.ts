import { DepartmentData } from 'src/core/entities/department.entity';
import {
  UpdateDepartmentRequestDto,
  CreateDepartmentRequestDto,
} from 'src/core/dtos/department/department.dto';

export interface IDepartmentRepository {
  findOne(id: number): Promise<DepartmentData>;
  find(): Promise<DepartmentData[]>;
  save(payload: CreateDepartmentRequestDto): Promise<DepartmentData>;
  delete(id: number): Promise<DepartmentData>;
  update(
    id: number,
    payload: UpdateDepartmentRequestDto,
  ): Promise<DepartmentData>;
}
