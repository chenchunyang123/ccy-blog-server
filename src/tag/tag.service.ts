import { Injectable } from '@nestjs/common';
import {
  Between,
  EntityManager,
  FindOperator,
  FindOptionsOrder,
  Like,
} from 'typeorm';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
  async create(createTagDto: CreateTagDto) {
    await this.tagRepository.save(createTagDto);
  }

  async findAllByPage(query) {
    const {
      page_num = 1,
      page_size = 20,
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
    const order: FindOptionsOrder<TagEntity> = {};
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

    const [list, total] = await this.tagRepository.findAndCount({
      where: queryFilter,
      order,
      skip: (page_num - 1) * page_size,
      take: page_size,
    });

    const formatList = [];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const dealItem = {
        ...item,
        article_count: await this.getArticleCountByTagId(item.id),
      };
      formatList.push(dealItem);
    }

    return {
      list: formatList,
      total,
    };
  }

  async getAll() {
    return await this.tagRepository.find({
      select: ['id', 'name'],
    });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    await this.tagRepository.update(id, updateTagDto);
  }

  async remove(id: number) {
    await this.entityManager.transaction(async (manager) => {
      // 删除中间表中所有包含该标签的记录
      await manager
        .createQueryBuilder()
        .delete()
        .from('article_tag')
        .where('tag_id = :id', { id })
        .execute();

      // 删除标签
      await manager
        .createQueryBuilder()
        .delete()
        .from('tag')
        .where('id = :id', { id })
        .execute();
    });
  }

  async getTagByIds(ids: number[]) {
    return await this.tagRepository.findBy({ id: In(ids) });
  }

  async getArticleCountByTagId(tagId: number) {
    const { count } = await this.entityManager
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('article_tag', 'at')
      .where('at.tag_id = :tagId', { tagId })
      .getRawOne();
    return +count;
  }
}
