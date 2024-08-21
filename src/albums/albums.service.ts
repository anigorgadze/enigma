import { Injectable } from '@nestjs/common';
import { AlbumsRepository } from './albums.repository';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { UpdateAlbumsDto } from './dto/update-albums.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AlbumsService {
  constructor(private readonly albumsRepository: AlbumsRepository , 
              private readonly filesService: FilesService,
              ) {}

  async create(createAlbumsDto: CreateAlbumsDto ,
      picture: Express.Multer.File,
      ) {

    const coverImgUrl = await this.filesService.uploadFile(picture, 'Images');  
     
    return this.albumsRepository.create(createAlbumsDto ,coverImgUrl.Location);
    
    
  }


  findAll() {
    return this.albumsRepository.findAll();
  }

  findOne(id: number) {
    return this.albumsRepository.findOne(id);
  }

  update(id: number, updateAlbumsDto: UpdateAlbumsDto) {
    return this.albumsRepository.update(id, updateAlbumsDto);
  }

  remove(id: number) {
    return this.albumsRepository.remove(id);
  }
}
