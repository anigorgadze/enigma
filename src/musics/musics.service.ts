import { Injectable } from '@nestjs/common';
import { MusicsRepository } from './musics.repository';
import { CreateMusicsDto } from './dto/create-musics.dto';
import { UpdateMusicsDto } from './dto/update-musics.dto';

@Injectable()
export class MusicsService {
  constructor(private readonly musicsRepository: MusicsRepository) {}

  create(createMusicsDto: CreateMusicsDto) {
    return this.musicsRepository.create(createMusicsDto);
  }

  findAll() {
    return this.musicsRepository.findAll();
  }

  findOne(id: number) {
    return this.musicsRepository.findOne(id);
  }

  update(id: number, updateMusicsDto: UpdateMusicsDto) {
    return this.musicsRepository.update(id, updateMusicsDto);
  }

  remove(id: number) {
    return this.musicsRepository.remove(id);
  }
}
