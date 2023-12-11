import { Body, Controller, Post } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';

import { AppService } from './app.service';
import { CreateUserDto } from 'src/modules/users/dto/user.dto';
import { UsersService } from 'src/modules/users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<UserModel, 'password'> | string> {
    return this.usersService.create(createUserDto);
  }
}
