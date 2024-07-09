import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Music } from './entities/music.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MusicRepository {

  constructor(
    @InjectRepository(Music)
    private musicRepository: Repository<Music>
  ) { }

  create(createMusicDto: CreateMusicDto) {

    const newMusic = this.musicRepository.create(createMusicDto)
    return this.musicRepository.save(newMusic)
  }

  async findAll() {
    return await this.musicRepository
      .createQueryBuilder('music')
      .getMany()
  }

  async findOne(id: number) {
    return await this.musicRepository
      .createQueryBuilder('music')
      .where('music.id =:id', { id })
      .getOne()
  }

  async update(id: number, updateMusicDto: UpdateMusicDto) {
    await this.musicRepository
      .createQueryBuilder('music')
      .update()
      .set(updateMusicDto)
      .where('music.id =:id', { id })
      .execute()

    return this.musicRepository
      .createQueryBuilder('music')
      .where('music.id =:id', { id })
      .getOne()
  } 


  async remove(id: number) {
    await this.musicRepository
    .createQueryBuilder('music')
    .where('music.id =:id' , {id})
    .softDelete()
    .execute()

    return this.musicRepository
    .createQueryBuilder('music')
    .withDeleted()
    .where('music.id =:id' , {id})
    .getOne()
  }

}
