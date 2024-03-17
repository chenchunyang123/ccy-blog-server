import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';

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
    const { pageNum = 1, pageSize = 20 } = query;

    const [list, total] = await this.categoryRepository.findAndCount({
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
