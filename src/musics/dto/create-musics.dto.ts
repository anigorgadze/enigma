import { IsString} from 'class-validator';

export class CreateMusicsDto {
  @IsString()
  title: string;
  
}
