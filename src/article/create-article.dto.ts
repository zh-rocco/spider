import { IsString, IsInt } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  cover: string;

  @IsString()
  author: string;

  @IsString()
  authorLink: string;

  @IsString()
  createTime: string;

  @IsString()
  content: string;

  @IsString()
  originUrl: string;

  @IsInt()
  views: number;
}
