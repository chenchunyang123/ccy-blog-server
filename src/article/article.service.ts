import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateArticleDto,
  GetAllArticleDto,
  UpdateArticleDto,
} from './dto/article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    await this.articleRepository.save(createArticleDto);
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

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  async remove(id: number) {
    const article = await this.articleRepository.findOne({
      where: {
        id,
      },
    });

    if (!article) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    }

    await this.articleRepository.remove(article);
  }
}
