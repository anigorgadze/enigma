import { Role } from 'aws-sdk/clients/budgets';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Roles } from 'src/auth/roles.decorator';

export class CreateUsersDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

}
