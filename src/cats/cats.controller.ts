import { TimeoutInterceptor } from 'src/interceptor/timeout.interceptor';
import { CacheInterceptor } from 'src/interceptor/cache.interceptor';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { RolesGuard } from 'src/guard/roles.guard';
import * as Joi from 'joi';
import { JoiValidationPipe } from 'src/pipe/joi-validation.pipe';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, of } from 'rxjs';
import { CatsService } from './cats.service';
import { Cat, ResponseStructure } from './cats.interface';
import { Roles } from 'src/decorator/roles.decorator';
import { ExcludeNullInterceptor } from 'src/interceptor/exclude-null.interceptor';
import { ErrorsInterceptor } from 'src/interceptor/errors.interceptor';
import { User } from 'src/decorator/user.decorator';

const createCatSchema = Joi.object().keys({
  name: Joi.string().required(),
  age: Joi.number().required(),
  breed: Joi.string().required(),
});

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

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
  @UseInterceptors(LoggingInterceptor)
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

  @Post('create-guard')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @UsePipes(new JoiValidationPipe(createCatSchema))
  async createGuard(
    @Res() response: Response,
    @Body() createCatDto: CreateCatDto,
    @User() user: { roles: string[] },
  ) {
    console.log('cat:', createCatDto);
    console.log('user:', user);

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

  @Get('interceptor')
  @HttpCode(200)
  @UseInterceptors(TransformInterceptor, ExcludeNullInterceptor)
  transformInterceptor() {
    return null;
  }

  @Get('errors')
  @UseInterceptors(ErrorsInterceptor)
  errorsInterceptor() {}

  @Get('cache')
  @UseInterceptors(TransformInterceptor, CacheInterceptor)
  cacheInterceptor() {
    return null;
  }

  @Get('timeout')
  @UseInterceptors(TimeoutInterceptor)
  async timeoutInterceptor() {
    await sleep(4000);
    return true;
  }
}
