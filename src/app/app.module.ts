import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { RecipesModule } from 'src/modules/recipes/recipes.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, RecipesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
