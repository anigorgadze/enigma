import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService:SearchService){}
  @Get()
  findAll(@Query('searchString') searchString: string) {
    return this.searchService.findAll(searchString)
  }
}
