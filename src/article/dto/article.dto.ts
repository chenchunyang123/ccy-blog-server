import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: '文章标题不能为空' })
  readonly title: string;

  readonly content: string;
}

export class UpdateArticleDto {}

export interface GetAllArticleDto {
  list: any[];
  total: number;
}
