import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [UserModule, DepartmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
