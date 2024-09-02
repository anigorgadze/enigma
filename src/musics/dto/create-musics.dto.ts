import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMusicsDto {
  @IsString()
  title: string;

  @IsString()
  artistName: string;

  @IsNotEmpty()
  @IsString()
  albumId: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  playlistsIds: number[];
}
