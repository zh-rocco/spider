import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { ListQuery, ListResponse } from 'src/common/interface/common.interface';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';

interface CustomQuery extends ListQuery {
  platform?: string;
}

@Controller('api/article')
@UseInterceptors(TransformInterceptor)
@UsePipes(new ValidationPipe({ skipMissingProperties: true }))
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getList(@Query() query: CustomQuery): Promise<ListResponse<Article>> {
    global.console.log('get article list:', query);

    const { page = 1, count = 10, platform } = query;
    const options = Object.assign(
      {
        skip: Math.max(0, +page - 1) * +count,
        take: +count,
      },
      platform ? { where: { platform } } : undefined,
    );
    const [data, total] = await this.articleService.getList(options);

    return { data, total };
  }
}
