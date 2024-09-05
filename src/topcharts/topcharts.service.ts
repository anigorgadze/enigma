import { Injectable } from '@nestjs/common';
import { CreateTopchartDto } from './dto/create-topchart.dto';
import { UpdateTopchartDto } from './dto/update-topchart.dto';
import { TopchartsRepository } from './topcharts.repository';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class TopchartsService {

  constructor(private readonly topchartsRepository: TopchartsRepository ,
    private readonly filesService: FilesService,) {}


    async create(
      createTopchartDto: CreateTopchartDto,
      picture: Express.Multer.File,
    ) {
      const coverImgResult = await this.filesService.uploadFile(
        picture,
        'Images',
      );
  
      const coverImgUrl = coverImgResult.url;
      return this.topchartsRepository.create(createTopchartDto, coverImgUrl);
    }
  
  findAll() {
    return this.topchartsRepository.findAll()
  }

  async findOne(id: number) {
     return this.topchartsRepository.findOne(id)
  }

  update(id: number, updateTopchartDto: UpdateTopchartDto) {
    return this.topchartsRepository.update(id, updateTopchartDto)
  }

  remove(id: number) {
    return  this.topchartsRepository.remove(id);
  }
}
