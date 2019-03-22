import { Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SpiderService } from './spider.service';

@Controller('api/spider')
@UsePipes(new ValidationPipe({ skipMissingProperties: true }))
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @Post('aotu/scrape-list')
  scrapeList() {
    return this.spiderService.scrapeList();
  }

  @Post('aotu/scrape-content')
  scrapeContent() {
    return this.spiderService.scrapeContent();
  }
}
