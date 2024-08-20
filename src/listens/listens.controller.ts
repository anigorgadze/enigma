import { Controller, Post, Body, Get, NotFoundException } from '@nestjs/common';

import { CreateListenRecordDto } from './dto/create-listenRecord.dto';
import { ListenRecordsService } from './listens.service';

@Controller('listen-records')
export class ListenRecordsController {
  constructor(private readonly listenRecordsService: ListenRecordsService) {}

  @Post()
  async create(@Body() createListenRecordDto: CreateListenRecordDto) {
    const { userId, musicId } = createListenRecordDto;
    try {
      return await this.listenRecordsService.create(userId, musicId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async findAll() {
    return this.listenRecordsService.findAll();
  }
}
