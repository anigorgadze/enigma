import { IsOptional, IsString } from 'class-validator';

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
}
