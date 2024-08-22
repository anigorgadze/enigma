import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateAuthorsDto {
  @IsString()
  artistName: string;

  @IsNumber()
  releaseDate: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => Array.isArray(value) ? value.map(Number) : [])
  musicsIds: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value.map(Number) : [])
  albumsIds: number[];
}
