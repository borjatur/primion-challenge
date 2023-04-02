import { IsNotEmpty, IsString } from 'class-validator';
import { 
  CreateUserHttpRequest
} from 'src/interfaces/user';

export class CreateUserHttpRequestDto implements CreateUserHttpRequest {
  @IsString()
  @IsNotEmpty()
  public readonly username: string;
}