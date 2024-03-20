import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Between, FindOperator, Like, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
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
    } = query;

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

    const [list, total] = await this.categoryRepository.findAndCount({
      where: queryFilter,
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
