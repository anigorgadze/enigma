import { Injectable } from '@nestjs/common';
import { MusicsRepository } from './musics.repository';
import { CreateMusicsDto } from './dto/create-musics.dto';
import { UpdateMusicsDto } from './dto/update-musics.dto';
import { FilesService } from 'src/files/files.service';


@Injectable()
export class MusicsService {
  constructor(private readonly musicsRepository: MusicsRepository, 
          private readonly filesService: FilesService) {}

async create(createMusicsDto: CreateMusicsDto, 
  picture: Express.Multer.File,
  audio: Express.Multer.File) 
{
  const coverImgUrl = await this.filesService.uploadFile(picture);   
  const audioUrl = await this.filesService.uploadFile(audio); 
  return this.musicsRepository.create(createMusicsDto, coverImgUrl, audioUrl)
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
