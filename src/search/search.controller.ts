import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/auth/public.decorator';

@Controller('search')
@Public()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAll(@Query('searchField') search: string) {
    return this.searchService.search(search);
  }
}
