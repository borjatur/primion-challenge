import { IsNotEmpty, IsString } from 'class-validator';
import { 
  CreateDepartmentHttpRequest
} from 'src/interfaces/department';

export class CreateDepartmentHttpRequestDto implements CreateDepartmentHttpRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}