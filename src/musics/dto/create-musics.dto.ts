import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMusicsDto {
  @IsString()
  title: string;

  @IsString()
  artistName: string;

  @IsNumber({}, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  albumsIds: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  authorsIds: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  playlistsIds: number[];
}
