import { IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: '标签名不能为空' })
  readonly name: string;
}

export class UpdateTagDto {
  @IsNotEmpty({ message: '新标签名不能为空' })
  readonly name: string;
}
