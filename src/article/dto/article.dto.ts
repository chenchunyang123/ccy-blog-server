import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: '文章标题不能为空' })
  readonly title: string;

  readonly content: string;

  readonly tags?: number[];

  readonly category?: number;
}

export class UpdateArticleDto {
  @IsNotEmpty({ message: '文章标题不能为空' })
  readonly title: string;

  readonly content: string;

  readonly tags?: number[];

  readonly category?: number;
}

export interface GetAllArticleDto {
  list: any[];
  total: number;
}
