import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MusicRepository {

  constructor(
    @InjectRepository(MusicEntity)
    private musicRepository: Repository<MusicEntity>
  ) { }

 async create(createMusicDto: CreateMusicDto) {

    const newMusic = this.musicRepository.create(createMusicDto)
    return  await this.musicRepository.save(newMusic)
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
      .createQueryBuilder()
      .update()
      .set(updateMusicDto)
      .where('id = :id', {id})
      .execute()

    return await this.musicRepository
      .createQueryBuilder('music')
      .where('music.id =:id', { id })
      .getOne()
  } 


  async remove(id: number) {
    await this.musicRepository
    .createQueryBuilder('music')
    .where('id =:id' , {id})
    .softDelete()
    .execute()

    return await this.musicRepository
    .createQueryBuilder('music')
    .withDeleted()
    .where('music.id =:id' , {id})
    .getOne()
  }
}
