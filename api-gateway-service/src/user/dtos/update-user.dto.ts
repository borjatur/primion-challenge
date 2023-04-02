import { IsNumber, IsString, ValidateIf } from 'class-validator';
import {
  UpdateUserHttpRequest
} from 'src/interfaces/user';


export class UpdateUserHttpRequestDto implements UpdateUserHttpRequest {
  @IsString()
  @ValidateIf(o => typeof o.deparmentId === undefined || o.username)
  public readonly username: string;

  @IsNumber()
  @ValidateIf(o => typeof o.username === undefined || o.departmentId)
  public readonly departmentId: number;
}