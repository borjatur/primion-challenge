import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  DEPARTMENT_SERVICE_NAME,
  DEPARTMENT_PACKAGE_NAME,
} from 'src/controllers/interfaces/department';
import {
  USER_SERVICE_NAME,
  USER_PACKAGE_NAME,
} from 'src/controllers/interfaces/user';
import { DepartmentController } from 'src/controllers/department.controller';
import { UserController } from 'src/controllers/user.controller';

const departmentClientService = ClientsModule.register([
  {
    name: DEPARTMENT_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50052',
      package: DEPARTMENT_PACKAGE_NAME,
      protoPath: 'node_modules/proto/department.proto',
    },
  },
]);

const userClientService = ClientsModule.register([
  {
    name: USER_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50053',
      package: USER_PACKAGE_NAME,
      protoPath: 'node_modules/proto/user.proto',
    },
  },
]);

@Module({
  imports: [departmentClientService, userClientService],
  controllers: [DepartmentController, UserController],
})
export class AppModule {}
