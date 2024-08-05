import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  imgUrl: string;

}
