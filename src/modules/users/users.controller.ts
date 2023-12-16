import { Controller, Get, Param } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<Omit<UserModel, 'password'>[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.usersService.findById(id);
  }

  @Get(':id/recipes')
  async findUserRecipes(@Param('id') id: string): Promise<any> {
    return this.usersService.findUserRecipes(id);
  }
}
