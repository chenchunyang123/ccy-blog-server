import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './entities/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), TagModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
