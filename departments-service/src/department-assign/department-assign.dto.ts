import { IsNumber, IsNotEmpty } from 'class-validator';
import { DepartmentAssignRequest } from './interfaces/create-department-assign';


export class DepartmentAssignRequestDto implements DepartmentAssignRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsNotEmpty()
  public readonly userId: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsNotEmpty()
  public readonly departmentId: number;
}