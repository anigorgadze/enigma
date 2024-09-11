import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/public.decorator';

@Controller('users')
export class UsersController {
  roles: Role[];
  authService: any;
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post()
  create(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Roles(Role.User, Role.Admin)
  @Get('me')
  findMe(@Request() req) {
    return this.usersService.findMe(req.user.sub);
  }

  @Roles(Role.User, Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/block')
  blockUser(@Param('id') id: number) {
    return this.usersService.blockUser(id);
  }

  @Patch(':id/unblock')
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
