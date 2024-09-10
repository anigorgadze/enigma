import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateListenRecordDto } from './dto/create-listenRecord.dto';
import { ListenRecordsService } from './listens.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/public.decorator';

@Controller('listen-records')
export class ListenRecordsController {
  constructor(private readonly listenRecordsService: ListenRecordsService) {}

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
