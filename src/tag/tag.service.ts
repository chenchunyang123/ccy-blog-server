import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
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

  async findAll() {
    return await this.tagRepository.find();
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
}
