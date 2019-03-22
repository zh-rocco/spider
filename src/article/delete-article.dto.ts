import { IsString } from 'class-validator';

export class DeleteArticleDto {
  @IsString()
  readonly id: string;
}
