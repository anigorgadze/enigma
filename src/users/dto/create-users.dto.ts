import { IsEmail, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}
