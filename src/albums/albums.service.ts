import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AlbumsRepository } from './albums.repository';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { UpdateAlbumsDto } from './dto/update-albums.dto';
import { FilesService } from 'src/files/files.service';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { AlbumEntity } from './entities/album.entity';

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

  async findAlbumById(id: number): Promise<AlbumEntity> {
    const album = await this.albumsRepository.findOne(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  findAll() {
    return this.albumsRepository.findAll();
  }

  findOne(id: number) {
    return this.albumsRepository.findOne(id);
  }

  async update(id: number, picture: Express.Multer.File) {
    const { url: coverImgUrl } = await this.filesService.uploadFile(
      picture,
      'Images',
    );
  
    if (!coverImgUrl) {
      throw new InternalServerErrorException('Failed to upload cover image');
    }
  
    return await this.albumsRepository.update(id, coverImgUrl);
  }


  remove(id: number) {
    return this.albumsRepository.remove(id);
  }

  async updateAndGetTopAlbums() {
    await this.albumsRepository.updateAllAlbumsPlayCounts();
    return this.albumsRepository.topAlbums();
  }

  async getRecentlyAddedAlbums() {
    return await this.albumsRepository.recentlyAddedAlbums();
  }
}
