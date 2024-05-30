import { Body, Controller, Get, Post } from '@nestjs/common';
import { SiteService } from './site.service';
import { UpdateSettingDto } from './dto/site.dto';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get()
  getSiteProperty() {
    return this.siteService.getSiteProperty();
  }

  @Get('/setting')
  getSiteSetting() {
    return this.siteService.getSiteSetting();
  }

  @Post('/setting')
  updateSiteSetting(@Body() updateSetting: UpdateSettingDto) {
    return this.siteService.updateSiteSetting(updateSetting);
  }
}
