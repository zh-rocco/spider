import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { CreateCatDto } from './dto/create-cat.dto';
import { ValidationPipe } from 'src/common/pipe/validation.pipe';

@Controller('api/cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('list')
  getAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  async createCat(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }
}
