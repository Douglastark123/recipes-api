import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Recipe as RecipeModel } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRecipeDto implements Partial<RecipeModel> {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  published: boolean;

  @IsNotEmpty()
  @IsString()
  authorId: string;
}

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}
