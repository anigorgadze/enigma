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
  const coverImgUrl = await this.filesService.uploadFile(picture, 'Images');   
  const audioUrl = await this.filesService.uploadFile(audio, 'Musics'); 
  return this.musicsRepository.create(createMusicsDto, coverImgUrl.Location, audioUrl.Location)
}

  findAll() {
    return this.musicsRepository.findAll();
  }

  topHits(){
    return this.musicsRepository.topHits()
  }

  findOne(id: number) {
    return this.musicsRepository.findOne(id);
  }

  async update(
    id: number,
    updateMusicsDto: UpdateMusicsDto,
    picture?: Express.Multer.File,
    audio?: Express.Multer.File,
  ) {
    let coverImgUrl: string | undefined;
    let audioUrl: string | undefined;
  
    if (picture) {
      const uploadedPicture = await this.filesService.uploadFile(picture, 'Images');
      coverImgUrl = uploadedPicture.Location;
    }
  
    if (audio) {
      const uploadedAudio = await this.filesService.uploadFile(audio, 'Musics');
      audioUrl = uploadedAudio.Location;
    }
  
    return this.musicsRepository.update(id, {
      ...updateMusicsDto,
      ...(coverImgUrl && { coverImgUrl }),
      ...(audioUrl && { audioUrl }),
    });
  }

  remove(id: number) {
    return this.musicsRepository.remove(id);
  }
}
