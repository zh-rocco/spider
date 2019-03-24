import { Injectable } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { aotuTask, taobaofedTask } from 'src/spider/crawlers/task';

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

  async scrapeTaobaofedList() {
    const articles = await taobaofedTask();

    for (const article of articles) {
      if (!(await this.articleService.findOne(article))) {
        this.articleService.create(article);
      }
    }

    return articles.length;
  }
}
