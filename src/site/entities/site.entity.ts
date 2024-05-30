import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('site')
export class SiteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  avatar_url: string; // 头像地址

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
  })
  updated_at: Date;
}
