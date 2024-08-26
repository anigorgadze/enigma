import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AlbumsRepository } from './albums.repository';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { UpdateAlbumsDto } from './dto/update-albums.dto';
import { FilesService } from 'src/files/files.service';
import { MusicEntity } from 'src/musics/entities/music.entity';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly albumsRepository: AlbumsRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createAlbumsDto: CreateAlbumsDto, picture: Express.Multer.File) {
    const { url: coverImgUrl } = await this.filesService.uploadFile(
      picture,
      'Images',
    );
    return this.albumsRepository.create(createAlbumsDto, coverImgUrl);
  }

  findAll() {
    return this.albumsRepository.findAll();
  }

  findOne(id: number) {
    return this.albumsRepository.findOne(id);
  }

  async update(
    id: number,
    updateAlbumsDto: UpdateAlbumsDto,
    picture?: Express.Multer.File,
    audio?: Express.Multer.File[],
    musicPicture?: Express.Multer.File,
  ) {
    let coverImgUrl: string | undefined;
    let audioUrls: string[] = [];
    let musicPictureUrl: string | undefined;

    if (picture) {
      ({ url: coverImgUrl } = await this.filesService.uploadFile(
        picture,
        'Images',
      ));
    }

    if (audio && audio.length > 0) {
      for (const audioFile of audio) {
        const { url: audioUrl } = await this.filesService.uploadFile(
          audioFile,
          'Musics',
        );
        audioUrls.push(audioUrl);
      }
    }

    if (musicPicture) {
      ({ url: musicPictureUrl } = await this.filesService.uploadFile(
        musicPicture,
        'MusicPictures',
      ));
    }

    return await this.albumsRepository.update(
      id,
      updateAlbumsDto,
      coverImgUrl,
      audioUrls,
      musicPictureUrl,
    );
  }

  remove(id: number) {
    return this.albumsRepository.remove(id);
  }

  async updateAndGetTopAlbums() {
    await this.albumsRepository.updateAllAlbumsPlayCounts();
    return this.albumsRepository.topAlbums();
  }
}
