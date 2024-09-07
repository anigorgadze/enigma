import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/users/entities/user.entity';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { ListenRecordsService } from './listens.service';
import { ListenRecordsController } from './listens.controller';
import { ListenRecordsRepository } from './listens.repository';
import { ListenRecordEntity } from './entities/listen.entity';
import { UsersModule } from 'src/users/users.module';
import { MusicsModule } from 'src/musics/musics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListenRecordEntity]),
    UsersModule,
    MusicsModule,
  ],
  providers: [ListenRecordsService, ListenRecordsRepository],
  controllers: [ListenRecordsController],
  exports: [ListenRecordsService],
})
export class ListenRecordsModule {}
