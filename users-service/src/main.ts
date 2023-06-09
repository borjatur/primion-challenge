import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './framework/app.module';
import { protobufPackage } from 'src/controllers/grpc/user.package';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // GRPC connector
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50053',
      package: protobufPackage,
      protoPath: join('node_modules/proto/user.proto'),
    },
  });

  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}

bootstrap();
