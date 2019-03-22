import {
  Controller,
  Get,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto } from './create-article.dto';
import { DeleteArticleDto } from './delete-article.dto';
import { UpdateArticleDto } from './update-article.dto';
import {
  CommonResponse,
  ListQuery,
  ListResponse,
} from 'src/common/interface/common.interface';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';

@Controller('api/article')
// @UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe({ skipMissingProperties: true }))
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('create')
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Delete('delete')
  delete(@Body() deleteArticleDto: DeleteArticleDto) {
    const { id } = deleteArticleDto;
    return this.articleService.delete(id);
  }

  @Post('update')
  update(@Body() updateArticleDto: UpdateArticleDto) {
    const { id, data } = updateArticleDto;
    return this.articleService.update(id, data);
  }

  @Get('getList')
  async getList(@Query() query: ListQuery): Promise<ListResponse<Article>> {
    global.console.log('aotu/getList:', query);

    const { page = 1, count = 10 } = query;
    const [data, total] = await this.articleService.getList({
      skip: Math.max(0, +page - 1) * +count,
      take: +count,
    });

    return { result: 0, data, total };
  }

  @Get('aotu/getById')
  async get(@Query() query: { id: string }): Promise<CommonResponse<Article>> {
    const { id } = query;
    global.console.log('aotu/getById:', id);

    if (id) {
      const article = await this.articleService.findOne({ id } as Article);
      return {
        result: 0,
        data: article || null,
      };
    }

    throw new HttpException('Miss query param "id".', HttpStatus.BAD_REQUEST);
  }
}
