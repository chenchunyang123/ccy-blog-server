import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  // 设置文章可有多个标签
  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  @JoinTable({
    name: 'article_tag',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];

  // 一个文章一个分类
  @ManyToOne(() => CategoryEntity, (category) => category.posts)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  category: CategoryEntity;

  // 字数
  @Column({ type: 'int' })
  word_count: number;

  // 阅读时长
  @Column({ type: 'int' })
  reading_duration_minutes: number;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
  })
  updated_at: Date;
}
