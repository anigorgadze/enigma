import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MusicsRepository } from './musics.repository';
import { CreateMusicsDto } from './dto/create-musics.dto';
import { UpdateMusicsDto } from './dto/update-musics.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class MusicsService {
  constructor(
    private readonly musicsRepository: MusicsRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(
    createMusicsDto: CreateMusicsDto,
    picture: Express.Multer.File,
    audio: Express.Multer.File,
  ) {
    const coverImgResult = await this.filesService.uploadFile(
      picture,
      'Images',
    );
    const audioResult = await this.filesService.uploadFile(audio, 'Musics');

    const coverImgUrl = coverImgResult.url;
    const audioUrl = audioResult.url;

    return this.musicsRepository.create(createMusicsDto, coverImgUrl, audioUrl);
  }

  findAll() {
    return this.musicsRepository.findAll();
  }

  topHits() {
    return this.musicsRepository.topHits();
  }

  findOne(id: number) {
    return this.musicsRepository.findOne(id);
  }

  async update(id: number, picture: Express.Multer.File) {
    const { url: coverImgUrl } = await this.filesService.uploadFile(
      picture,
      'Images',
    );
  
    if (!coverImgUrl) {
      throw new InternalServerErrorException('Failed to upload cover image');
    }
  
    return await this.musicsRepository.update(id, coverImgUrl);
  }

  remove(id: number) {
    return this.musicsRepository.remove(id);
  }
  async getRecentlyAddedMusics() {
    return await this.musicsRepository.recentlyAddedMusics();
  }

  async shuffleMusics() {
    const musics = await this.musicsRepository.findAll();
    for (let i = musics.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [musics[i], musics[j]] = [musics[j], musics[i]];
    }
    return musics;
  }
}
