import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipes.dto';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  async findAll(): Promise<any> {
    return await this.recipesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.recipesService.findById(id);
  }

  @Post()
  async register(@Body() createRecipeDto: CreateRecipeDto): Promise<any> {
    return await this.recipesService.register(createRecipeDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<any> {
    return await this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<any> {
    return await this.recipesService.delete(id);
  }
}
