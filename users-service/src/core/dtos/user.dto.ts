import { IsString, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import {
  CreateUserRequest,
  GetUserByIdRequest,
  UpdateUserByIdRequest,
  DeleteUserByIdRequest,
  GetAllUsersByDepartmentRequest,
} from 'src/core/interfaces/user.pb';

export class CreateUserRequestDto implements CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  public readonly username: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsNotEmpty()
  public readonly departmentId: number;
}

export class UpdateUserRequestDto implements UpdateUserByIdRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;

  @IsString()
  @ValidateIf((o) => typeof o.deparmentId === undefined || o.username)
  public readonly username: string;

  @IsNumber()
  @ValidateIf((o) => typeof o.username === undefined || o.departmentId)
  public readonly departmentId: number;
}

export class GetUserByIdRequestDto implements GetUserByIdRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;
}

export class UpdateUserByIdRequestDto implements UpdateUserByIdRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;

  @IsString()
  @IsNotEmpty()
  public readonly username: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly departmentId: number;
}

export class DeleteUserByIdRequestDto implements DeleteUserByIdRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;
}

export class GetAllUsersByDepartmentDto
  implements GetAllUsersByDepartmentRequest
{
  @IsNumber({ allowInfinity: false, allowNaN: false })
  departmentId: number;
}
