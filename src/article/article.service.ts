import { pickBy, identity } from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    return await this.articleRepository.save(createArticleDto);
  }

  async delete(id: string): Promise<boolean> {
    const { affected } = await this.articleRepository.delete(id);

    return !!affected;
  }

  async update(id: string, data: CreateArticleDto): Promise<boolean> {
    const {
      raw: { changedRows },
    } = await this.articleRepository.update(id, data);

    return !!changedRows;
  }

  async findOne(article: Article): Promise<Article> {
    const { id, title, author } = article;

    return await this.articleRepository.findOne(
      pickBy({ id, title, author }, identity),
    );
  }

  async getList(
    query?: FindManyOptions<Article>,
  ): Promise<[Article[], number]> {
    return await this.articleRepository.findAndCount(
      Object.assign(
        {
          order: {
            createAt: 'ASC',
          },
          select: [
            'id',
            'title',
            'description',
            'cover',
            'author',
            'authorLink',
            'createTime',
          ],
        },
        query,
      ),
    );
  }
}
