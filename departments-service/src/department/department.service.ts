import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { 
  CreateDepartmentRequestDto,
  GetDepartmentByIdRequestDto,
  UpdateDepartmentByIdRequestDto,
  DeleteDepartmentByIdRequestDto
} from './department.dto';
import { 
  CreateDepartmentResponse,
  GetAllDepartmentsResponse,
  GetDepartmentByIdResponse,
  UpdateDepartmentByIdResponse,
  DeleteDepartmentByIdResponse
 } from './department.pb';

@Injectable()
export class DepartmentService {
  @InjectRepository(Department)
  private readonly repository: Repository<Department>;

  public async getDepartmentById({ id }: GetDepartmentByIdRequestDto): Promise<GetDepartmentByIdResponse> {
    const department: Department = await this.repository.findOne({ where: { id }, relations: ['departmentAssign'] });

    if (!department) {
      return { data: null, error: ['Department not found'] };
    }

    return { data: department, error: null };
  }

  public async createDepartment({ name }: CreateDepartmentRequestDto): Promise<CreateDepartmentResponse> {
    const department: Department = new Department();
    department.name = name;
    try {
      const response = await this.repository.save(department);
      return { data: response, error: null };
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        return { data: null, error: [`Existing Department with name ${name}`] };
      }
      return { data: null, error: [err.message] }
    }
  }

  public async getAllDepartments(): Promise<GetAllDepartmentsResponse> {
    const departments: Department[] = await this.repository.find({ relations: ['departmentAssign'] });
    return { data: departments, error: null };
  }

  public async updateDepartmentById(payload: UpdateDepartmentByIdRequestDto): Promise<UpdateDepartmentByIdResponse> {
    const department: Department = await this.repository.findOne({ where: { id: payload.id } });
    if (!department) {
      return { data: null, error: ['Department not found'] };
    }
    const updatedDepartment = { ...department, ...payload };
    try {
      const response = await this.repository.save(updatedDepartment);
      return { data: response, error: null };
    } catch (err) {
      return { data: null, error: [err.message] };
    }
  }

  public async deleteDepartmentById(payload: DeleteDepartmentByIdRequestDto): Promise<DeleteDepartmentByIdResponse> {
    const department: Department = await this.repository.findOne({ where: { id: payload.id } });
    if (!department) {
      return { error: ['Department not found'] };
    }
    await this.repository.remove(department);
    return { error: null };
  }
}