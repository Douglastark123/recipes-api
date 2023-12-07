import { Injectable } from '@nestjs/common';
import { Prisma, User as UserModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserModel[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<UserModel> {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<UserModel | string> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExists) {
      return 'User already exists';
    }

    return await this.prisma.user.create({
      data,
    });
  }
}
