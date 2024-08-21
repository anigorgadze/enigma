import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { MusicEntity } from 'src/musics/entities/music.entity';

@Entity({ name: 'listen_record' })
export class ListenRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.listenRecords)
  user: UserEntity;

  @ManyToOne(() => MusicEntity, (music) => music.listenRecords)
  music: MusicEntity;

  @CreateDateColumn()
  listenedAt: Date;
}
