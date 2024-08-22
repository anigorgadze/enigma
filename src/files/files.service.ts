import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
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

console.log(params);

    try {
      const data = await this.s3.upload(params).promise();
      return data
    } catch (error) {
      console.log(error);
      
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}