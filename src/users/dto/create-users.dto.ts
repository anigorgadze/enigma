import { Role } from 'aws-sdk/clients/budgets';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Roles } from 'src/auth/roles.decorator';

export class CreateUsersDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

   

}
