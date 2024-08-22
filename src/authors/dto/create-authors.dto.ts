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

  @IsDateString()
  releaseDate: Date;

  @IsString()
  coverImgUrl: string;

  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(Number))
  musicsIds: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  albumsIds: number[];
}
