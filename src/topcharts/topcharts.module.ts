import { Module } from '@nestjs/common';
import { TopchartsService } from './topcharts.service';
import { TopchartsController } from './topcharts.controller';
import { TopchartsRepository } from './topcharts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
import { TopchartEntity } from './entities/topchart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopchartEntity]),
    FilesModule,
    TopchartsModule,
  ],
  controllers: [TopchartsController],
  providers: [TopchartsService , TopchartsRepository],

})
export class TopchartsModule {}
