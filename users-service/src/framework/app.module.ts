import { Module } from '@nestjs/common';
import { UserController } from 'src/controllers/grpc/user.controller';
import { UserService } from 'src/core/use-cases/user.service';
import { UserRepository } from 'src/controllers/persistence/user.repo';
import { createClient } from '@redis/client';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'REDIS_OPTIONS',
      useValue: {
        url: 'redis://localhost:6379',
      },
    },
    {
      inject: ['REDIS_OPTIONS'],
      provide: 'IPublisherRepository',
      useFactory: async (options: { url: string }) => {
        const client = createClient(options);
        await client.connect();
        return client;
      },
    },
    UserService,
  ],
})
export class AppModule {}
