import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 100 })
  username: string; // 用户名

  @Column({ length: 100, nullable: true })
  nickname: string; //昵称

  @Exclude()
  @Column()
  password: string; // 密码

  @Column({ nullable: true })
  avatar: string; //头像

  @Column({ nullable: true })
  email: string;

  @Column('simple-enum', { enum: ['admin', 'visitor'], default: 'visitor' })
  role: string; // 用户角色

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

  @BeforeInsert()
  async encryptPwd() {
    if (!this.password) return;
    this.password = await bcrypt.hashSync(this.password, 10);
  }
}
