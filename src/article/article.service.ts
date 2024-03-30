import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import {
  Between,
  FindOperator,
  FindOptionsOrder,
  Like,
  Repository,
} from 'typeorm';
import { TagService } from 'src/tag/tag.service';
import { CategoryService } from 'src/category/category.service';
import {
  countSpecificCharacters,
  estimateReadingTimeInMinutes,
} from 'src/utils/tool';
import { map } from 'rxjs';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly tagService: TagService,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  async create(data: CreateArticleDto) {
    // tags传递的是标签id数组
    const { tag_ids, category_id } = data;

    let tagList;
    // 如果传了tags，就去查找对应的标签
    if (tag_ids?.length) {
      tagList = await this.tagService.getTagByIds(tag_ids);
    }

    let categoryObj;
    // 如果传了category_id，就去查找对应的分类
    if (category_id) {
      categoryObj = await this.categoryService.getCategoryById(category_id);
    }

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
    const {
      page_num = 1,
      page_size = 20,
      title,
      created_at_from,
      created_at_to,
      created_at,
      updated_at,
    } = query;

    // 设置请求filter
    const queryFilter: {
      title?: FindOperator<string>;
      created_at?: FindOperator<Date>;
    } = {};
    if (created_at_from && created_at_to) {
      const endDate = new Date(created_at_to);

      queryFilter.created_at = Between(
        new Date(created_at_from),
        new Date(endDate.setDate(endDate.getDate() + 1)),
      );
    }
    if (title) {
      queryFilter.title = Like(`%${title}%`);
    }

    // 设置order
    const order: FindOptionsOrder<ArticleEntity> = {};
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

    const [list, total] = await this.articleRepository.findAndCount({
      where: queryFilter,
      relations: ['tags', 'category'],
      order,
      skip: (page_num - 1) * page_size,
      take: page_size,
    });

    return {
      list,
      total,
    };
  }

  async findById(id: number) {
    const article = await this.articleRepository.findOne({
      where: {
        id,
      },
      relations: ['tags', 'category'],
    });

    if (!article) {
      throw new HttpException(`文章不存在`, HttpStatus.BAD_REQUEST);
    }

    return article;
  }

  async update(id: number, data: UpdateArticleDto) {
    const { tag_ids } = data;

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

    if (tag_ids) {
      const tagList = await this.tagService.getTagByIds(tag_ids);
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

  async getArticleCountByCategoryId(id: number) {
    return await this.articleRepository
      .createQueryBuilder('article')
      .where('article.category_id = :id', { id })
      .getCount();
  }

  async getArticleProperty() {
    // 获取文章总字数，每篇文章字数的字段名是word_count
    const articleCount = await this.articleRepository.count();
    const totalWordCount = await this.articleRepository
      .createQueryBuilder('article')
      .select('SUM(article.word_count)', 'total_word_count')
      .getRawOne();

    return {
      article_count: articleCount,
      total_word_count: +totalWordCount.total_word_count || 0,
    };
  }

  async getArticleByMonth() {
    // 返回一个数组，数组中的每个元素是一个对象，对象的key是月份加年份如：一月 2024，value是这个月的文章数量
    const articleList = await this.articleRepository.find({
      select: ['created_at'],
    });

    const monthMap = new Map();

    articleList.forEach((article) => {
      const month = article.created_at.getMonth() + 1;
      const year = article.created_at.getFullYear();
      const key = `${year}-${month}`;
      if (monthMap.has(key)) {
        monthMap.set(key, monthMap.get(key) + 1);
      } else {
        monthMap.set(key, 1);
      }
    });

    const resList = [];
    monthMap.forEach((value, key) => {
      resList.push({
        year_month: key,
        count: value,
      });
    });

    return resList;
  }
}
