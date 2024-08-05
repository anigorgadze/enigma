import { IsDateString, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAuthorsDto {
  @IsString()
  name: string;

  @IsDateString()
  releaseDate: string;

  @IsUrl()
  imgUrl: string;
  
  @IsNumber({}, { each: true })
  musicsIds: number[]

  @IsNumber({}, { each: true })
  @IsOptional()
  albumsIds: number[];

}
