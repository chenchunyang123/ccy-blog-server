import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { Repository } from 'typeorm';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly tagService: TagService,
  ) {}

  async create(data: CreateArticleDto) {
    // tags传递的是标签id数组
    const { tags } = data;

    const tagList = await this.tagService.getTagByIds(tags);

    const articleParams = {
      ...data,
      tags: tagList,
    };

    await this.articleRepository.save(articleParams);
  }

  async findAll(query) {
    const { pageNum = 1, pageSize = 20 } = query;
    const res = await this.articleRepository.findAndCount({
      order: {
        created_at: 'DESC',
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
    const list = res[0];
    const total = res[1];
    return {
      list,
      total,
    };
  }

  async update(id: number, data: UpdateArticleDto) {
    const { tags } = data;

    // 通过id找到article文章
    const article = await this.articleRepository.findOne({
      where: {
        id,
      },
    });

    if (!article)
      throw new HttpException(`要修改的文章不存在`, HttpStatus.BAD_REQUEST);

    article.title = data.title;
    article.content = data.content;

    if (tags) {
      const tagList = await this.tagService.getTagByIds(tags);
      article.tags = tagList;
    }

    await this.articleRepository.save(article);
  }

  async remove(id: number) {
    const article = await this.articleRepository.findOne({
      where: {
        id,
      },
    });

    if (!article) {
      throw new HttpException(`文章已经不存在了`, HttpStatus.BAD_REQUEST);
    }

    await this.articleRepository.remove(article);
  }
}
