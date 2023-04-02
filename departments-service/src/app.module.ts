import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './department/department.module';
import { DepartmentAssignModule } from './department-assign/department-assign.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // host: 'localhost',
      // port: 5432,
      database: 'departments.sqlite',
      // username: 'borja',
      // password: null,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true
    }),
    DepartmentModule,
    DepartmentAssignModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}