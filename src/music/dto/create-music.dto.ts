import { IsString, IsUrl } from 'class-validator';

export class CreateMusicDto {
  @IsString()
  title: string;

  @IsString()
  coverImgUrl: string;

  @IsUrl()
  audioUrl: string;

}
