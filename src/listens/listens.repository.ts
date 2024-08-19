import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListenRecordEntity } from './entities/listen.entity';
import { UsersRepository } from 'src/users/users.repository';
import { MusicsRepository } from 'src/musics/musics.repository';

@Injectable()
export class ListenRecordsRepository {
  constructor(
    @InjectRepository(ListenRecordEntity)
    private listenRecordsRepository: Repository<ListenRecordEntity>,
    private usersRepository: UsersRepository,
    private musicsRepository: MusicsRepository,
  ) {}

  async create(userId: number, musicId: number) {
    const user = await this.usersRepository.findOne(userId);
    const music = await this.musicsRepository.findOne(musicId);

    if (!user || !music) {
      throw new NotFoundException('User or Music not found');
    }

    const lastRecord = await this.listenRecordsRepository.findOne({
      where: { user: { id: userId }, music: { id: musicId } },
      order: { listenedAt: 'DESC' },
    });

    const currentTime = new Date();
    const timeInterval = 60 * 1000;
    const timeDifference = lastRecord
      ? currentTime.getTime() - lastRecord.listenedAt.getTime()
      : Infinity;

    console.log(timeDifference / 1000);
    if (timeDifference < timeInterval) {
      throw new Error(
        `You cannot listen to this music again within ${60 - Math.floor(timeDifference / 1000)} seconds.`,
      );
    }

    const record = new ListenRecordEntity();
    record.user = user;
    record.music = music;
    record.listenedAt = currentTime;
    await this.listenRecordsRepository.save(record);

    music.playCount++;
    await this.musicsRepository.listensCounter(music);
    return record;
  }

  async findAll() {
    return this.listenRecordsRepository.find();
  }
}
