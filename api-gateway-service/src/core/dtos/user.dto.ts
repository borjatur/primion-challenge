import { IsNotEmpty, IsString, ValidateIf, IsNumber } from 'class-validator';
import { CreateUserRequest } from 'src/core/interfaces/user/create-user.interface';
import { UpdateUserRequest } from 'src/core/interfaces/user/update-user.interface';

export class CreateUserRequestDto implements CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  public readonly username: string;
}

export class UpdateUserRequestDto implements UpdateUserRequest {
  @IsString()
  @ValidateIf((o) => typeof o.deparmentId === undefined || o.username)
  public readonly username: string;

  @IsNumber()
  @ValidateIf((o) => typeof o.username === undefined || o.departmentId)
  public readonly departmentId: number;
}
