import { Injectable } from '@nestjs/common';
import { AlbumsRepository } from 'src/albums/albums.repository';
import { AuthorsRepository } from 'src/authors/authors.repository';
import { MusicsRepository } from 'src/musics/musics.repository';

@Injectable()
export class SearchService {
  constructor(
    private readonly musicsRepository: MusicsRepository,
    private readonly authorsRepository: AuthorsRepository,
    private readonly albumsRepository: AlbumsRepository,
  ) {}

  async search(search: string) {
    const musics = await this.musicsRepository.findByTitle(search);
    const authors = await this.authorsRepository.findByName(search);
    const albums = await this.albumsRepository.findByTitle(search);

    const results = [
      ...musics.map((music) => ({ type: 'music', data: music })),
      ...authors.map((author) => ({ type: 'author', data: author })),
      ...albums.map((album) => ({ type: 'album', data: album })),
    ];

    return results;
  }
}
