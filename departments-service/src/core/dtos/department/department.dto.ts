import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import {
  CreateDepartmentRequest,
  DeleteDepartmentByIdRequest,
  GetDepartmentByIdRequest,
  UpdateDepartmentByIdRequest,
} from 'src/core/interfaces/department.pb';

export class CreateDepartmentRequestDto implements CreateDepartmentRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}

export class GetDepartmentByIdRequestDto implements GetDepartmentByIdRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;
}

export class UpdateDepartmentRequestDto implements UpdateDepartmentByIdRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;

  @IsString()
  @IsOptional()
  public readonly name: string;
}

export class DeleteDepartmentByIdRequestDto
  implements DeleteDepartmentByIdRequest
{
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;
}
