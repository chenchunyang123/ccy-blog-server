import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: '文章标题不能为空' })
  readonly title: string;

  @IsNotEmpty({ message: '文章内容不能为空' })
  readonly content: string;

  readonly tag_ids?: number[];

  readonly category_id?: number;
}

export class UpdateArticleDto {
  @IsNotEmpty({ message: '文章标题不能为空' })
  readonly title: string;

  readonly content: string;

  readonly tag_ids?: number[];

  readonly category_id?: number;
}

export interface GetAllArticleDto {
  list: any[];
  total: number;
}
