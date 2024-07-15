import { Injectable } from '@nestjs/common';
import { MusicsRepository } from 'src/musics/musics.repository';

@Injectable()
export class SearchService {
  constructor(private readonly musicsRepository: MusicsRepository) {}

  findAll(searchString: string) {
    return 'asd'
  }
}
