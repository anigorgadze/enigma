import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
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
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  musicsIds: number[];

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  authorsIds: number[];

  @IsString()
  @IsOptional()
  coverImgUrl: string
}

