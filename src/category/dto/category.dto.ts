import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: '分类名不能为空' })
  readonly name: string;
}

export class UpdateCategoryDto {
  @IsNotEmpty({ message: '新分类名不能为空' })
  readonly name: string;
}
