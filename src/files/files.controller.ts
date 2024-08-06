import { Body, Controller, InternalServerErrorException, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { title } from 'process';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]))
  async uploadFiles(@UploadedFiles() files , @Body('title') title: string) {
    const { audio, cover} = files;
    if (!audio || !cover ) {
      throw new InternalServerErrorException('Both audio and cover files are required');
    }
    const music = await this.filesService.uploadFiles(audio[0], cover[0] , title);
    return music;
  }
}