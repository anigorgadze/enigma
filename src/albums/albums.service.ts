import { Injectable } from '@nestjs/common';
import { AlbumsRepository } from './albums.repository';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { UpdateAlbumsDto } from './dto/update-albums.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly albumsRepository: AlbumsRepository) {}

  create(createAlbumsDto: CreateAlbumsDto) {
    return this.albumsRepository.create(createAlbumsDto);
  }

  findAll() {
    return this.albumsRepository.findAll();
  }

  findOne(id: number) {
    return this.albumsRepository.findOne(id);
  }

  update(id: number, updateAlbumsDto: UpdateAlbumsDto) {
    return this.albumsRepository.update(id, updateAlbumsDto);
  }

  remove(id: number) {
    return this.albumsRepository.remove(id);
  }
}
