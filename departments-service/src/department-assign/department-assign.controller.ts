import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { DepartmentAssignService } from 'src/department-assign/department-assign.service';
import { DepartmentAssignRequest } from 'src/department-assign/interfaces/create-department-assign';

@Controller('department-assign')
export class DepartmentAssignController {
  private logger = new Logger('department-assign');

  @Inject(DepartmentAssignService)
  private readonly departmentAssignService: DepartmentAssignService;

  @EventPattern('ADD_USER')
  async createDepartmentAssign(payload: DepartmentAssignRequest) {
    const result = await this.departmentAssignService.createDepartmentAssign(payload);
    this.logger.log(`ADD_USER ${JSON.stringify(result)}`)
  }

  @EventPattern('EDIT_USER')
  async editDepartmentAssign(payload: DepartmentAssignRequest) {
    const result = await this.departmentAssignService.editDepartmentAssign(payload);
    this.logger.log(`EDIT_USER ${JSON.stringify(result)}`)
  }

  @EventPattern('DELETE_USER')
  async deleteDepartmentAssign(payload: DepartmentAssignRequest) {
    const result = await this.departmentAssignService.deleteDepartmentAssign(payload);
    this.logger.log(`DELETE_USER ${JSON.stringify(result)}`)
    
  }
}
