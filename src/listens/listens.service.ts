import { Injectable } from '@nestjs/common';
import { ListenRecordsRepository } from './listens.repository';

@Injectable()
export class ListenRecordsService {
  constructor(
    private readonly listenRecordsRepository: ListenRecordsRepository,
  ) {}

  async create(userId: number, musicId: number) {
    return this.listenRecordsRepository.create(userId, musicId);
  }

  findAll() {
    return this.listenRecordsRepository.findAll();
  }
}
