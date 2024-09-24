import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  Request,
} from '@nestjs/common';

import { CreateListenRecordDto } from './dto/create-listenRecord.dto';
import { ListenRecordsService } from './listens.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@Controller('listen-records')
export class ListenRecordsController {
  constructor(private readonly listenRecordsService: ListenRecordsService) {}

  @Roles(Role.User, Role.Admin)
  @Post()
  async create(
    @Request() req,
    @Body() createListenRecordDto: CreateListenRecordDto,
  ) {
    const { musicId } = createListenRecordDto;

    try {
      return await this.listenRecordsService.create(req.user.sub, musicId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async findAll() {
    return this.listenRecordsService.findAll();
  }
}
