import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
