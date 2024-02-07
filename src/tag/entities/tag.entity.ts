import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleEntity } from '../../article/entities/article.entity';

@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => ArticleEntity, (post) => post.tags)
  posts: ArticleEntity[];

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
