import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  //es davamate
  @Post()
  @Roles(Role.Admin)
  create(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto)
  }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() createUsersDto: CreateUsersDto) {
    return this.usersService.update(id, createUsersDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
// function Roles(Admin: any): (target: UsersController, propertyKey: "create", descriptor: TypedPropertyDescriptor<(createUserDto: CreateUserDto) => Promise<import("./entities/user.entity").UserEntity>>) => void | TypedPropertyDescriptor<...> {
//   throw new Error('Function not implemented.');
// }

