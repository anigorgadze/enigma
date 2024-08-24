import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

@Injectable()
export class FilesService {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, directory = '') {
    if (!file || !file.buffer) {
      throw new InternalServerErrorException('File data is missing');
    }

    const fileName = `${uuidv4()}_${file.originalname}`;
    const params = {
      Bucket: 'engm-bucket',
      Key: `${directory}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

     
      const url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

      return { url }; 
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Could not upload file, try again later!',
      );
    }
  }
}
