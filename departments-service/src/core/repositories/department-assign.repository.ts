import { DepartmentAssignData } from 'src/core/entities/department-assign.entity';
import { DepartmentAssignRequestDto } from 'src/core/dtos/department-assign/department-assign.dto';

export interface IDepartmentAssignRepository {
  save(payload: DepartmentAssignRequestDto): Promise<DepartmentAssignData>;
  searchUpdate(
    payload: DepartmentAssignRequestDto,
  ): Promise<DepartmentAssignData>;
  searchDelete(
    payload: DepartmentAssignRequestDto,
  ): Promise<DepartmentAssignData>;
}
