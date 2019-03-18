import { ValidationPipe } from './../pipe/validation.pipe';
import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Req,
  Param,
  Post,
  Body,
  HttpCode,
  Header,
  HttpException,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  users = [{ name: 'rocco', age: 32 }];

  @Get()
  @HttpCode(200)
  @Header('Cache-Control', 'no-cache')
  getAllUsers() {
    return {
      result: 0,
      data: this.users,
    };
  }

  @Get(':id')
  getUser(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    console.log(`Request path: ${req.path}`);
    console.log(`Resource id: ${id}`);

    res.status(HttpStatus.OK).json({
      result: 0,
      data: id,
    });
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createUser(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    console.dir(createUserDto);

    res.status(HttpStatus.CREATED).send({
      result: 0,
      success: true,
    });
  }

  @Post('create-error')
  createError(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    console.dir(createUserDto);

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
