import { IsDateString, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAuthorsDto {
  @IsString()
  name: string;

  @IsDateString()
  releaseDate: string;

  @IsUrl()
  imgUrl: string;

  @IsNumber()
  @IsOptional()
  userId: number;
}
