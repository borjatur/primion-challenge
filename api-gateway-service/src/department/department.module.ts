import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DEPARTMENT_SERVICE_NAME, DEPARTMENT_PACKAGE_NAME } from './department.pb';
import { USER_SERVICE_NAME, USER_PACKAGE_NAME } from '../user/user.pb';
import { DepartmentController } from './department.controller';

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
  imports: [
    departmentClientService,
    userClientService
  ],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
