import { pickBy, identity } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/article/article.entity';
import { CreateArticleDto } from 'src/article/create-article.dto';
import { aotuListCrawler } from 'src/spider/crawlers/aotu-list.crawler';
import { aotuContentCrawler } from 'src/spider/crawlers/aotu-content.crawler';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class SpiderService {
  constructor(private readonly articleService: ArticleService) {}

  async scrapeList() {
    const articles = await aotuListCrawler();
    global.console.log('Scrape list - aotu:', articles.length);

    for (const article of articles) {
      if (!(await this.articleService.findOne(article as Article))) {
        this.articleService.create(article as CreateArticleDto);
      }
    }

    global.console.log('Scrape list - aotu: successfully');
    return articles.length;
  }

  async scrapeContent() {
    const [articles] = await this.articleService.getList({
      select: ['id', 'originUrl'],
    });

    for (const article of articles) {
      const res = await aotuContentCrawler(article.originUrl);
      if (res) {
        global.console.log('Scrape content - aotu:', res.content.length);
        this.articleService.update(article.id, pickBy(
          res,
          identity,
        ) as CreateArticleDto);
      }
    }

    global.console.log('Scrape content - aotu: successfully');
    return articles.length;
  }
}
