import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { TopchartsService } from './topcharts.service';
import { CreateTopchartDto } from './dto/create-topchart.dto';
import { UpdateTopchartDto } from './dto/update-topchart.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Files } from 'aws-sdk/clients/iotsitewise';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('topcharts')
@UseGuards(RolesGuard)
export class TopchartsController {
  constructor(private readonly topchartsService: TopchartsService) {}


  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles() files: { picture?: Express.Multer.File[] },
    @Body() createTopchartDto: CreateTopchartDto,
  ) {
    const picture = files?.picture ? files.picture[0] : null;
    if (!picture) {
      throw new InternalServerErrorException('File is missing');
    }
    return this.topchartsService.create(createTopchartDto, picture);
  }

  @Roles(Role.Admin, Role.User)
  @Get()
  findAll() {
    return this.topchartsService.findAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topchartsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTopchartDto: UpdateTopchartDto,
  ) {
    return this.topchartsService.update(+id, updateTopchartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topchartsService.remove(+id);
  }
}
