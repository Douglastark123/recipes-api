import { Injectable } from '@nestjs/common';
import { Prisma, User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Omit<UserModel, 'password'>[]> {
    const users = await this.prisma.user.findMany();

    users.forEach((user: UserModel) => delete user.password);

    return users;
  }

  async findById(id: string): Promise<Omit<UserModel, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    delete user.password;

    return user;
  }

  async findByEmail(email: string): Promise<UserModel> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async create(
    user: Prisma.UserCreateInput,
  ): Promise<Omit<UserModel, 'password'> | string> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (userExists) {
      return 'User already exists';
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);

    const data = {
      ...user,
      password: hashedPassword,
    };

    const userCreated = await this.prisma.user.create({
      data,
    });

    delete userCreated.password;

    return userCreated;
  }
}
