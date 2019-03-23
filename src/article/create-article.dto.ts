import { IsString, IsInt } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  cover: string;

  @IsString()
  link: string;

  @IsString()
  platform: string;

  @IsInt()
  views: number;
}
