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
} from '@nestjs/common';
import { Request, Response } from 'express';

interface CreateUserDto {
  readonly name: string;
  readonly age: number;
}

@Controller('users')
export class UsersController {
  users = [{ name: 'rocco', age: 32 }];

  @Get()
  getAllUsers(@Res() res: Response) {
    res.status(HttpStatus.OK).json({
      result: 0,
      data: this.users,
    });
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
  createUser(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    console.dir(createUserDto);

    res.status(HttpStatus.CREATED).send({
      result: 0,
      success: true,
    });
  }
}
