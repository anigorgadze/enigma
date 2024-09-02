import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListenRecordEntity } from './entities/listen.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { MusicEntity } from 'src/musics/entities/music.entity';

@Injectable()
export class ListenRecordsRepository {
  constructor(
    @InjectRepository(ListenRecordEntity)
    private listenRecordsRepository: Repository<ListenRecordEntity>,
  ) {}

  async create(userId: number, musicId: number) {
    const lastRecord = await this.listenRecordsRepository.findOne({
      where: { user: { id: userId }, music: { id: musicId } },
      order: { listenedAt: 'DESC' },
    });

    if (lastRecord) {
      const currentTime = new Date();
      const timeInterval = 60 * 1000;
      const timeDifference = lastRecord
        ? currentTime.getTime() - lastRecord.listenedAt.getTime()
        : Infinity;

      if (timeDifference < timeInterval) {
        throw new Error(
          `You cannot listen to this music again within ${
            60 - Math.floor(timeDifference / 1000)
          } seconds.`,
        );
      }

      const record = new ListenRecordEntity();
      record.user = { id: userId } as UserEntity;
      record.music = { id: musicId } as MusicEntity;
      record.listenedAt = currentTime;
      await this.listenRecordsRepository.save(record);

      await this.listenRecordsRepository.manager.increment(
        MusicEntity,
        { id: musicId },
        'playCount',
        1,
      );

      const { password, ...userWithoutPassword } = record.user;

      const result = {
        ...record,
        user: userWithoutPassword,
      };

      return result;
    }

    throw new Error('Music not found');
  }

  async findAll() {
    return this.listenRecordsRepository.find();
  }
}
