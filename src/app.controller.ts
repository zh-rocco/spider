import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ArticleService } from 'src/article/article.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  @Render('index')
  async root() {
    return {
      message: this.appService.getHello(),
      articles: (await this.articleService.getList())[0],
    };
  }
}
