import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateAlbumsDto {
  @IsString()
  title: string;

  @IsString()
  releaseDate: string;

  @IsString()
  artistName: string;

  @IsString()
  authorId: number;

  @IsString()
  @IsOptional()
  coverImgUrl: string;
}
