import { IsNotEmpty } from 'class-validator';

export class UpdateSettingDto {
  @IsNotEmpty({ message: '头像地址不能为空' })
  avatar_url: string;
  @IsNotEmpty({ message: '封面图片地址不能为空' })
  cover_url: string;
}
