import { Controller, Get } from '@nestjs/common';
import { SiteService } from './site.service';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get()
  findAllByPage() {
    return this.siteService.getSiteProperty();
  }
}
