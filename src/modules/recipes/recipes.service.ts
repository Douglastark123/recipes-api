import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipes.dto';
import { UsersService } from 'src/modules/users/users.service';
import { Prisma, Recipe as RecipeModel } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<RecipeModel[]> {
    const recipes = await this.prismaService.recipe.findMany();

    return recipes;
  }

  async findById(id: string): Promise<any> {
    try {
      const recipe = await this.prismaService.recipe.findUnique({
        where: {
          id,
        },
      });

      if (!recipe) {
        throw new NotFoundException(`Recipe with ID ${id} not found`);
      }

      return recipe;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2023') {
          throw new NotFoundException(`Recipe with ID ${id} not found`);
        }
        return e;
      }
    }
  }

  async register(createRecipeDto: CreateRecipeDto): Promise<any> {
    await this.usersService.findById(createRecipeDto.authorId);

    const recipe = await this.prismaService.recipe.create({
      data: createRecipeDto,
    });

    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<any> {
    await this.findById(id);

    return await this.prismaService.recipe.update({
      where: {
        id,
      },
      data: updateRecipeDto,
    });
  }

  async delete(id: string): Promise<any> {
    await this.findById(id);

    try {
      await this.prismaService.recipe.delete({
        where: {
          id,
        },
      });

      return;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return e;
      }
    }
  }
}
