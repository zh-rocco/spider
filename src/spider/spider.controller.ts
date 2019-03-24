import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';

@Controller('api/scrape')
@UseInterceptors(TransformInterceptor)
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @Post('aotu')
  scrapeAotuList() {
    return this.spiderService.scrapeAotuList();
  }

  @Post('taobaofed')
  scrapeTaobaofedList() {
    return this.spiderService.scrapeTaobaofedList();
  }
}
