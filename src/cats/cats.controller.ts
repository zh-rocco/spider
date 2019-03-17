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

interface CreateCatDto {
  readonly name: string;
  readonly age: number;
}

@Controller('cats')
export class CatsController {
  @Get()
  @HttpCode(200)
  @Header('Cache-Control', 'none')
  findAll() {
    return {
      result: 0,
      data: 'meow',
    };
  }

  @Post('create')
  createCat(@Res() response: Response, @Body() createCatDto: CreateCatDto) {
    console.log(createCatDto);

    response.status(HttpStatus.CREATED).send({
      result: 0,
      success: true,
    });
  }
}
