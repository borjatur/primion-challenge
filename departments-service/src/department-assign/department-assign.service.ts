import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentAssign } from 'src/entities/department-assign.entity';
import { DepartmentAssignRequestDto } from 'src/department-assign/department-assign.dto';
import { DepartmentAssignResponse } from 'src/department-assign/interfaces/create-department-assign';
import { DepartmentService } from 'src/department/department.service';

@Injectable()
export class DepartmentAssignService {
  @InjectRepository(DepartmentAssign)
  private readonly departmentAssignRepository: Repository<DepartmentAssign>;

  constructor(private departmentService: DepartmentService) {}

  public async createDepartmentAssign(departmentAssignDto: DepartmentAssignRequestDto): Promise<DepartmentAssignResponse> {
    const departmentResponse = await this.departmentService.getDepartmentById({ id: departmentAssignDto.departmentId });

    if (departmentResponse?.data) {
      try {
        const departmentAssign = await this.departmentAssignRepository.create({ 
          userId: departmentAssignDto.userId, 
          department: { 
            id: departmentResponse?.data.id
          }
        });
        const response = await this.departmentAssignRepository.save(departmentAssign);
        return { data: response, error: null };
      } catch (err) {
        return { data: null, error: [err.message] }
      }
    }
  }

  public async editDepartmentAssign(departmentAssignDto: DepartmentAssignRequestDto): Promise<DepartmentAssignResponse> {
    const departmentResponse = await this.departmentService.getDepartmentById({ id: departmentAssignDto.departmentId });
    if (departmentResponse?.data) {
      const departmentAssign = await this.departmentAssignRepository.findOneBy({
        userId: departmentAssignDto.userId
      });

      if (departmentAssign) {
        departmentAssign.department.id = departmentAssignDto.departmentId;
        try {
          const response = await this.departmentAssignRepository.save(departmentAssign);
          return { data: response, error: null };
        } catch (err) {
          return { data: null, error: [err.message] };
        }
      } else {
        return this.createDepartmentAssign(departmentAssignDto);
      }
    }
    return { data: null, error: [`Department with id ${departmentAssignDto.departmentId} does not exist`] };
  }

  public async deleteDepartmentAssign(departmentAssignDto: DepartmentAssignRequestDto): Promise<DepartmentAssignResponse> {
    const departmentAssign = await this.departmentAssignRepository.findOneBy({
      userId: departmentAssignDto.userId
    });
    try {
      const removedDepartmentAssing = await this.departmentAssignRepository.remove(departmentAssign);
      return { data: removedDepartmentAssing, error: null };
    } catch (err) {
      return { data: null, error: [err.message] };
    }
  }
  
}
