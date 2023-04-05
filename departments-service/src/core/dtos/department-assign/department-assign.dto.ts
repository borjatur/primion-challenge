import { IsNumber, IsNotEmpty } from 'class-validator';
import { DepartmentAssignRequest } from 'src/core/interfaces/department-assign';

export class DepartmentAssignRequestDto implements DepartmentAssignRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsNotEmpty()
  public readonly userId: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsNotEmpty()
  public readonly departmentId: number;
}
