import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateAlbumsDto {
  @IsString()
  title: string;

  @IsString()
  releaseDate: string;

  @IsString()
  artistName: string;

  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  musicsIds: number[];

  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  authorsIds: number[];

  @IsString()
  coverImgUrl:string
}

