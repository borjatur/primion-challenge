import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { 
  CreateUserRequest,
  GetUserByIdRequest,
  UpdateUserByIdRequest,
  DeleteUserByIdRequest,
  UserData
} from './user.pb';

// export class UserDto implements UserData {
//   @IsNumber({ allowInfinity: false, allowNaN: false })
//   public readonly id: number;

//   @IsString()
//   @IsNotEmpty()
//   public readonly username: string;
// }

export class CreateUserRequestDto implements CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  public readonly username: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsNotEmpty()
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