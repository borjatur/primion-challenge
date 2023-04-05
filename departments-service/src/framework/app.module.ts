import { Module } from '@nestjs/common';
import { DepartmentController } from 'src/controllers/grpc/department.controller';
import { DepartmentAssignController } from 'src/controllers/redis/department-assign.controller';
import { DepartmentRepository } from 'src/controllers/persistence/department/department.repository';
import { DepartmentAssignRepository } from 'src/controllers/persistence/department-assign/department-assign.repository';
import { DepartmentService } from 'src/core/use-cases/department.service';
import { DepartmentAssignService } from 'src/core/use-cases/department-assign.service';
import { DataSource } from 'typeorm';
import { DepartmentAssign } from 'src/controllers/persistence/department-assign/department-assign.entity';
import { Department } from 'src/controllers/persistence/department/department.entity';

@Module({
  controllers: [DepartmentController, DepartmentAssignController],
  providers: [
    {
      provide: 'Datasource',
      useFactory: async () => {
        const datasource = new DataSource({
          type: 'sqlite',
          database: 'departments.sqlite',
          entities: [DepartmentAssign, Department],
          synchronize: true,
        });
        await datasource.initialize();
        return datasource;
      },
    },
    {
      provide: 'IDepartmentRepository',
      useClass: DepartmentRepository,
    },
    {
      provide: 'IDepartmentAssignRepository',
      useClass: DepartmentAssignRepository,
    },
    DepartmentAssignService,
    DepartmentService,
  ],
})
export class AppModule {}
