import { Role } from 'aws-sdk/clients/budgets';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateUsersDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  
  @IsBoolean()
  isAdmin?: boolean;
}
