import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ArticleService } from 'src/article/article.service';
import { SiteEntity } from './entities/site.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSettingDto } from './dto/site.dto';

@Injectable()
export class SiteService {
  constructor(
    @Inject(ArticleService)
    private readonly articleService: ArticleService,
    @InjectRepository(SiteEntity)
    private siteRepository: Repository<SiteEntity>,
  ) {}

  async getSiteProperty() {
    const res = await this.articleService.getArticleProperty();
    return {
      ...res,
      // 建站天数,使用dayjs计算
      site_days: dayjs().diff(dayjs('2024-03-28'), 'day'),
    };
  }

  async getSiteSetting() {
    const res = await this.siteRepository.find();
    return res[0];
  }

  async updateSiteSetting(updateSetting: UpdateSettingDto) {
    const { avatar_url, cover_url } = updateSetting;
    const res = await this.siteRepository.update(
      { id: 1 },
      {
        avatar_url,
        cover_url,
      },
    );
    if (!res.affected) {
      throw new InternalServerErrorException('更新失败');
    }
    return null;
  }
}
