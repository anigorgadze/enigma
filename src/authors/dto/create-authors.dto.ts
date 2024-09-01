import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAuthorsDto {
  @IsString()
  artistName: string;

  @IsString()
  releaseDate: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  biography: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  musicsIds: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  albumsIds: number[];

  @IsString()
  @IsOptional()
  albumTitle: string;

  @IsString()
  @IsOptional()
  albumReleaseDate: string;

  @IsString()
  @IsOptional()
  albumArtistName: string;
}
