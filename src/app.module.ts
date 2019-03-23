import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpiderModule } from './spider/spider.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mm12345mm',
      database: 'spider',
      charset: 'utf8mb4',
      entities: ['src/**/**.entity{.ts,.js}'],
      synchronize: true,
    }),
    ArticleModule,
    SpiderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
