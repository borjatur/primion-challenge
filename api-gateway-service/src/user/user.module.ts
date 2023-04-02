import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_NAME, USER_PACKAGE_NAME } from './user.pb';
import { DEPARTMENT_SERVICE_NAME, DEPARTMENT_PACKAGE_NAME } from '../department/department.pb';
import { UserController } from './user.controller';

const departmentServiceClient = ClientsModule.register([
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

const userServiceClient = ClientsModule.register([
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
    userServiceClient,
    departmentServiceClient
  ],
  controllers: [UserController],
})

export class UserModule {}
