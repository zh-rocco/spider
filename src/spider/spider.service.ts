import { Injectable } from '@nestjs/common';
import { aotuTask } from 'src/spider/crawlers/task';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class SpiderService {
  constructor(private readonly articleService: ArticleService) {}

  async scrapeAotuList() {
    const articles = await aotuTask();

    for (const article of articles) {
      if (!(await this.articleService.findOne(article))) {
        this.articleService.create(article);
      }
    }

    return articles.length;
  }
}
