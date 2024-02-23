import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { Repository } from 'typeorm';
import { TagService } from 'src/tag/tag.service';
import { CategoryService } from 'src/category/category.service';
import {
  countSpecificCharacters,
  estimateReadingTimeInMinutes,
} from 'src/utils/tool';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(data: CreateArticleDto) {
    // tags传递的是标签id数组
    const { tags, category } = data;

    const tagList = await this.tagService.getTagByIds(tags);

    const categoryObj = await this.categoryService.getCategoryById(category);

    const articleParams = {
      ...data,
      tags: tagList,
      category: categoryObj,
      word_count: countSpecificCharacters(data.content),
      reading_duration_minutes: estimateReadingTimeInMinutes(data.content),
    };

    await this.articleRepository.save(articleParams);
  }

  async findAll(query) {
    const { pageNum = 1, pageSize = 20 } = query;

    const [list, total] = await this.articleRepository.findAndCount({
      relations: ['tags', 'category'],
      order: {
        created_at: 'DESC',
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

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
