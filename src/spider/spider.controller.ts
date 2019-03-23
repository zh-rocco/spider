import { Controller, Post } from '@nestjs/common';
import { SpiderService } from './spider.service';

@Controller('api/scrape')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @Post('aotu')
  scrapeAotuList() {
    return this.spiderService.scrapeAotuList();
  }
}
