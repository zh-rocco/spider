import * as Joi from 'joi';
import { JoiValidationPipe } from './../pipe/joi-validation.pipe';
import { HttpExceptionFilter } from './../filter/http-exception.filter';
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
  UseFilters,
  ForbiddenException,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, of } from 'rxjs';
import { CatsService } from './cats.service';
import { Cat, ResponseStructure } from './cats.interface';

const createCatSchema = Joi.object().keys({
  name: Joi.string().required(),
  age: Joi.number().required(),
  breed: Joi.string().required(),
});

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

  @Get('promise')
  async findAllList1(): Promise<any[]> {
    return ['from', 'promise'];
  }

  @Get('observable')
  findAllList2(): Observable<any[]> {
    return of(['from', 'rxjs']);
  }

  @Post('create')
  @UsePipes(new JoiValidationPipe(createCatSchema))
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

  @Post('create-error')
  @UseFilters(HttpExceptionFilter)
  async createError(
    @Res() response: Response,
    @Body() createCatDto: CreateCatDto,
  ) {
    console.log('cat:', createCatDto);

    throw new ForbiddenException();
  }
}
