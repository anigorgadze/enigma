import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicEntity } from 'src/musics/entities/music.entity';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCSESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCSESS_KEY,
  region: process.env.AWS_REGION,
});

@Injectable()
export class FilesService {
  private readonly s3 = new AWS.S3();

  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicsRepository: Repository<MusicEntity>,
  ) {}

  async uploadFiles(audioFile, coverFile, title: string): Promise<MusicEntity> {
    const audioFileName = `${uuidv4()}_${audioFile.originalname}`;
    const coverFileName = `${uuidv4()}_${coverFile.originalname}`;

    const audioParams = {
      Bucket: 'engm-bucket',
      Key: audioFileName,
      Body: audioFile.buffer,
      ContentType: audioFile.mimetype
    };

    const coverParams = {
      Bucket: 'engm-bucket',
      Key: coverFileName,
      Body: coverFile.buffer,
      ContentType: coverFile.mimetype
    };


    try {
      const audioData = await this.s3.upload(audioParams).promise();
      const coverData = await this.s3.upload(coverParams).promise();

      const newMusic = new MusicEntity();
      newMusic.audioUrl = audioData.Location;
      newMusic.coverImgUrl = coverData.Location;
      newMusic.title = title
      
      return await this.musicsRepository.save(newMusic);
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new InternalServerErrorException('Failed to upload files');
    }
  }
}