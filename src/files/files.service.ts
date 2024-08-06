import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicEntity } from 'src/musics/entities/music.entity';
import * as dotenv from 'dotenv'
import {v4 as uuidv4} from 'uuid'
import { log } from 'console';

dotenv.config()

AWS.config.update({
    accessKeyId: process.env.AWS_ACCSESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCSESS_KEY,
    region:process.env.AWS_REGION
    
}) 

console.log( process.env.AWS_ACCSESS_KEY_ID)
console.log( process.env.AWS_SECRET_ACCSESS_KEY)
console.log(process.env.AWS_REGION)

@Injectable()
export class FilesService {
  private readonly s3 = new AWS.S3();

  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicsRepository: Repository<MusicEntity>,
  ) {}

  async uploadFile(file): Promise<MusicEntity> {
    const randomFileName= `${uuidv4()}_${file.originalname}`
    const params = {

      Bucket: 'engm-bucket',
      Key: randomFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
   
    

    try {
     
      const data = await this.s3.upload(params).promise();
      const fileUrl = data.Location;

      
      const newMusic = new MusicEntity();
      newMusic.audioUrl = fileUrl;
      

      return await this.musicsRepository.save(newMusic);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}

// m.p[ailode]