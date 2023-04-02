import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

const redisClient = ClientsModule.register([{
  name: 'REDIS_CLIENT',
  transport: Transport.REDIS,
  options : {
    host: 'localhost',
    port: 6379
  }
}])

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    redisClient
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}