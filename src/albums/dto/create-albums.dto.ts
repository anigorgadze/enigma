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

  @IsDateString()
  releaseDate: Date;

  @IsString()
  artistName: string;

  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(Number))
  musicsIds: number[];

  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(Number))
  authorsIds: number[];
}
