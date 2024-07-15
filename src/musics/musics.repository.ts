import { Injectable } from '@nestjs/common';
import { CreateMusicsDto } from './dto/create-musics.dto';
import { UpdateMusicsDto } from './dto/update-musics.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MusicsRepository {

  constructor(
    @InjectRepository(MusicEntity)
    private musicsRepository: Repository<MusicEntity>
  ) {}

 async create(createMusicsDto: CreateMusicsDto) {

    const newMusic = this.musicsRepository.create(createMusicsDto)
    return  await this.musicsRepository.save(newMusic)
  }

  async findAll() {
    return await this.musicsRepository
      .createQueryBuilder('music')
      .getMany()
  }

  async findOne(id: number) {
    return await this.musicsRepository
      .createQueryBuilder('music')
      .where('music.id =:id', { id })
      .getOne()
  }
  
  async update(id: number, updateMusicsDto: UpdateMusicsDto) {
    await this.musicsRepository
      .createQueryBuilder('music')
      .update()
      .set(updateMusicsDto)
      .where('music.id = :id', {id})
      .execute()

    return await this.musicsRepository
      .createQueryBuilder('music')
      .where('music.id =:id', { id })
      .getOne()
  } 


  async remove(id: number) {
    await this.musicsRepository
    .createQueryBuilder('music')
    .where('music.id =:id' , {id})
    .softDelete()
    .execute()

    return await this.musicsRepository
    .createQueryBuilder('music')
    .withDeleted()
    .where('music.id =:id' , {id})
    .getOne()
  }
}
