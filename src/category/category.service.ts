import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import {
  Between,
  FindOperator,
  FindOptionsOrder,
  Like,
  Repository,
} from 'typeorm';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    await this.categoryRepository.save(createCategoryDto);
  }

  async findAll(query) {
    const {
      pageNum = 1,
      pageSize = 20,
      name,
      created_at_from,
      created_at_to,
      created_at,
      updated_at,
    } = query;

    // 设置请求filter
    const queryFilter: {
      name?: FindOperator<string>;
      created_at?: FindOperator<Date>;
    } = {};
    if (created_at_from && created_at_to) {
      const endDate = new Date(created_at_to);

      queryFilter.created_at = Between(
        new Date(created_at_from),
        new Date(endDate.setDate(endDate.getDate() + 1)),
      );
    }
    if (name) {
      queryFilter.name = Like(`%${name}%`);
    }

    // 设置order
    const order: FindOptionsOrder<CategoryEntity> = {};
    if (created_at) {
      order['created_at'] = created_at?.slice(0, -3);
    }
    if (updated_at) {
      order['updated_at'] = updated_at?.slice(0, -3);
    }
    // order是空对象, 设置默认值
    if (Object.keys(order).length === 0) {
      order['created_at'] = 'desc';
    }

    const [list, total] = await this.categoryRepository.findAndCount({
      where: queryFilter,
      order,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    const formatList = [];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const dealItem = {
        ...item,
        article_count: await this.articleService.getArticleCountByCategoryId(
          item.id,
        ),
      };
      formatList.push(dealItem);
    }

    return {
      list: formatList,
      total,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    await this.categoryRepository.delete(id);
  }

  async getCategoryById(id: number) {
    return await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }
}
