import { Module } from '@nestjs/common';
import { SpiderController } from './spider.controller';
import { SpiderService } from './spider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/article/article.entity';
import { ArticleModule } from 'src/article/article.module';
import { ArticleService } from 'src/article/article.service';
import { ArticleController } from 'src/article/article.controller';

@Module({
  imports: [ArticleModule],
  controllers: [SpiderController],
  providers: [SpiderService],
})
export class SpiderModule {}
