import { IsString, IsUrl } from 'class-validator';

export class CreateMusicDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;
}
