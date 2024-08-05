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

  @IsUrl()
  coverUrl: string;

  @IsNumber({}, { each: true })
  musicsIds: number[];

  @IsNumber({}, { each: true })
  authorsIds: number[];
}
