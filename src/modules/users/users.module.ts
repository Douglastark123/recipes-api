import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [PrismaModule],
})
export class UsersModule {}
