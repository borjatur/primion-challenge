import { IsNotEmpty, IsString } from 'class-validator';
import { 
  UpdateDepartmentHttpRequest
} from 'src/interfaces/department';

export class UpdateDepartmentHttpRequestDto implements UpdateDepartmentHttpRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}