import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class SiteService {
  constructor(
    @Inject(ArticleService)
    private readonly articleService: ArticleService,
  ) {}
  async getSiteProperty() {
    const res = await this.articleService.getArticleProperty();
    return {
      ...res,
      // 建站天数,使用dayjs计算
      site_days: dayjs().diff(dayjs('2024-03-28'), 'day'),
    };
  }
}
