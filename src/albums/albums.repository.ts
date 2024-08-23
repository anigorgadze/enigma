import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { UpdateAlbumsDto } from './dto/update-albums.dto';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { AuthorEntity } from 'src/authors/entities/author.entity';

@Injectable()
export class AlbumsRepository {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumsRepository: Repository<AlbumEntity>,
  ) {}

  async create(createAlbumsDto: CreateAlbumsDto, picture: string) {
    const newAlbum = new AlbumEntity();
    newAlbum.artistName = createAlbumsDto.artistName;
    newAlbum.coverImgUrl = picture;
    newAlbum.title = createAlbumsDto.title;
    newAlbum.releaseDate = createAlbumsDto.releaseDate;

    try {
      await this.albumsRepository.save(newAlbum);
      return newAlbum;
    } catch (exc) {
      console.log(exc);
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return await this.albumsRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.musics', 'albumMusics')
      .getMany();
  }

  async findOne(id: number) {
    return await this.albumsRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.musics', 'albumMusics')
      .where('album.id = :id', { id })
      .getOne();
  }

  async findByTitle(search: string) {
    return await this.albumsRepository
      .createQueryBuilder('album')
      .where('album.title LIKE :searchField', {
        searchField: `%${search}%`,
      })
      .getMany();
  }

  async update(
    id: number,
    updateAlbumsDto: UpdateAlbumsDto,
    coverImgUrl?: string,
    audioUrls?: string[],
    musicPictureUrl?: string
  ) {
    const album = await this.albumsRepository.findOne({
      where: { id },
      relations: ['musics', 'authors'],
    });
  
    if (!album) {
      throw new InternalServerErrorException();
    }
  
    album.title = updateAlbumsDto.title;
    album.releaseDate = updateAlbumsDto.releaseDate;
    album.coverImgUrl = coverImgUrl || album.coverImgUrl;
  
    if (audioUrls) {
      const newMusics = audioUrls.map(url => {
        const music = new MusicEntity();
        music.title = updateAlbumsDto.musicTitle || 'Untitled'; 
        music.audioUrl = url;
        music.coverImgUrl = musicPictureUrl; 
        return music;
      });
      album.musics = [...album.musics, ...newMusics];
    }
  
    if (updateAlbumsDto.musicsIds) {
      const currentMusicIds = album.musics.map(music => music.id);
      const newMusicIds = updateAlbumsDto.musicsIds.filter(
        id => !currentMusicIds.includes(id),
      );
      const allMusicIds = [...currentMusicIds, ...newMusicIds];
      album.musics = allMusicIds.map(id => ({ id }) as MusicEntity);
    }
  
    if (updateAlbumsDto.authorsIds) {
      const currentAuthorIds = album.authors.map(author => author.id);
      const newAuthorIds = updateAlbumsDto.authorsIds.filter(
        id => !currentAuthorIds.includes(id),
      );
      const allAuthorIds = [...currentAuthorIds, ...newAuthorIds];
      album.authors = allAuthorIds.map(id => ({ id }) as AuthorEntity);
    }
  
    try {
      await this.albumsRepository.save(album);
      return album;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    await this.albumsRepository
      .createQueryBuilder('album')
      .where('album.id = :id', { id })
      .softDelete()
      .execute();

    return await this.albumsRepository
      .createQueryBuilder('album')
      .withDeleted()
      .where('album.id = :id', { id })
      .getOne();
  }
}
