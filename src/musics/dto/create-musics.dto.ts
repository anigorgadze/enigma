import { IsString, IsUrl } from 'class-validator';

export class CreateMusicsDto {
  @IsString()
  title: string;

  @IsString()
  coverImgUrl: string;

  @IsUrl()
  audioUrl: string;
}
