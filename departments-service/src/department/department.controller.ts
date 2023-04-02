import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { 
  CreateDepartmentRequestDto,
  GetDepartmentByIdRequestDto,
  UpdateDepartmentByIdRequestDto,
  DeleteDepartmentByIdRequestDto
} from './department.dto';
import { 
  CreateDepartmentResponse,
  GetDepartmentByIdResponse,
  UpdateDepartmentByIdResponse,
  DeleteDepartmentByIdResponse,
  DEPARTMENT_SERVICE_NAME, 
  GetAllDepartmentsResponse
} from './department.pb';
import { DepartmentService } from './department.service';

@Controller()
export class DepartmentController {
  @Inject(DepartmentService)
  private readonly service: DepartmentService;

  @GrpcMethod(DEPARTMENT_SERVICE_NAME, 'CreateDepartment')
  private createDepartment(payload: CreateDepartmentRequestDto): Promise<CreateDepartmentResponse> {
    return this.service.createDepartment(payload);
  }

  @GrpcMethod(DEPARTMENT_SERVICE_NAME, 'GetDepartmentById')
  private getDepartmentById(payload: GetDepartmentByIdRequestDto): Promise<GetDepartmentByIdResponse> {
    return this.service.getDepartmentById(payload);
  }

  @GrpcMethod(DEPARTMENT_SERVICE_NAME, 'UpdateDepartmentById')
  private updateDepartmentById(payload: UpdateDepartmentByIdRequestDto): Promise<UpdateDepartmentByIdResponse> {
    return this.service.updateDepartmentById(payload);
  }

  @GrpcMethod(DEPARTMENT_SERVICE_NAME, 'DeleteDepartmentById')
  private deleteDepartmentById(payload: DeleteDepartmentByIdRequestDto): Promise<DeleteDepartmentByIdResponse> {
    return this.service.deleteDepartmentById(payload);
  }

  @GrpcMethod(DEPARTMENT_SERVICE_NAME, 'GetAllDepartments')
  private getAllDepartments(): Promise<GetAllDepartmentsResponse> {
    return this.service.getAllDepartments();
  }
}