import { CreateCatDto } from './create-cat.dto';
import {
  Controller,
  Get,
  HttpCode,
  Header,
  Post,
  Res,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, of } from 'rxjs';
import { CatsService } from './cats.service';
import { Cat, ResponseStructure } from './cats.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @HttpCode(200)
  @Header('Cache-Control', 'no-cache')
  async findAll(): Promise<ResponseStructure<Cat[]>> {
    return {
      result: 0,
      data: await this.catsService.findAll(),
    };
  }

  @Get('list-1')
  async findAllList1(): Promise<any[]> {
    return ['from', 'promise'];
  }

  @Get('list-2')
  findAllList2(): Observable<any[]> {
    return of(['from', 'rxjs']);
  }

  @Post('create')
  async createCat(
    @Res() response: Response,
    @Body() createCatDto: CreateCatDto,
  ) {
    console.log('cat:', createCatDto);

    await this.catsService.create(createCatDto);

    response.status(HttpStatus.CREATED).send({
      result: 0,
      success: true,
    });
  }
}
