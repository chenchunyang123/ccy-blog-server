import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { ArticleModule } from 'src/article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteEntity } from './entities/site.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteEntity]), ArticleModule],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
