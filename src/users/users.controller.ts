import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { Public } from 'src/auth/public.decorator';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
@Public()
export class UsersController {
  roles:Role[]
  authService: any;
  constructor(private readonly usersService: UsersService) {}



  @Post()
  @Public()
  create(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
    
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
  @Patch(':id/block')
  @UseGuards(JwtAuthGuard)
  blockUser(@Param('id') id: number) {
    return this.usersService.blockUser(id);
  }
  
  @Patch(':id/unblock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  unblockUser(@Param('id') id: number) {
    return this.usersService.unblockUser(id);
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
