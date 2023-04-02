import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentAssignController } from 'src/department-assign/department-assign.controller';
import { DepartmentAssign } from 'src/entities/department-assign.entity';
import { DepartmentAssignService } from 'src/department-assign/department-assign.service';
import { DepartmentModule } from 'src/department/department.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepartmentAssign]),
    DepartmentModule
  ],
  controllers: [DepartmentAssignController],
  providers: [DepartmentAssignService],
})
export class DepartmentAssignModule { }