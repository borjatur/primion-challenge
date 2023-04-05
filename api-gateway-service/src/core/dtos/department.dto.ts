import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDepartmentRequest } from 'src/core/interfaces/department/create-department.interface';
import { UpdateDepartmentRequest } from 'src/core/interfaces/department/update-department.interface';

export class CreateDepartmentRequestDto implements CreateDepartmentRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}

export class UpdateDepartmentRequestDto implements UpdateDepartmentRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}
