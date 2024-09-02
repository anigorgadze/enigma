import { Optional } from '@nestjs/common';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  title: string;

  @IsNumber()
  @IsOptional()
  musicId: number;

  @IsNumber()
  @IsOptional()
  playlistId: number;
}
