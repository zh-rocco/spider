import { IsString, ValidateNested } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto {
  @IsString()
  id: string;

  @ValidateNested()
  data: CreateArticleDto;
}
