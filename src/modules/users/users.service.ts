import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  User as UserModel,
  Recipe as RecipeModel,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Omit<UserModel, 'password'>[]> {
    const users = await this.prismaService.user.findMany();

    users.forEach((user: UserModel) => delete user.password);

    return users;
  }

  async findById(
    id: string,
  ): Promise<Omit<UserModel, 'password'> | PrismaClientKnownRequestError> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      delete user.password;

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2023') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        return e;
      }
    }
  }

  async findByEmail(email: string): Promise<UserModel> {
    return await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async create(
    user: CreateUserDto,
  ): Promise<Omit<UserModel, 'password'> | string> {
    const userExists = await this.findByEmail(user.email);

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);

    const data = {
      ...user,
      password: hashedPassword,
    };

    const userCreated = await this.prismaService.user.create({
      data,
    });

    delete userCreated.password;

    return userCreated;
  }

  async findUserRecipes(
    id: string,
  ): Promise<RecipeModel[] | PrismaClientKnownRequestError> {
    try {
      await this.findById(id);

      const recipes = await this.prismaService.recipe.findMany({
        where: {
          authorId: id,
        },
      });

      return recipes;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2023') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        return e;
      }
    }
  }
}
