import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipes.dto';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  public async findAll(): Promise<any> {
    return await this.recipesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.recipesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async register(
    @Request() req: any,
    @Body() createRecipeDto: CreateRecipeDto,
  ): Promise<any> {
    const id = req.user.id as string;

    if (id !== createRecipeDto.authorId) {
      throw new UnauthorizedException(
        'You are not authorized to save a recipe on behalf of another user.',
      );
    }

    return await this.recipesService.register(createRecipeDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<any> {
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'You are not authorized to update a recipe on behalf of another user.',
      );
    }

    return await this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async delete(@Request() req: any, @Param('id') id: string): Promise<any> {
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'You are not authorized to delete a recipe on behalf of another user.',
      );
    }

    return await this.recipesService.delete(id);
  }
}
