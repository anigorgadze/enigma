import { LikedMusicEntity } from 'src/likedMusics/entities/likedmusics.entity';
import { ListenRecordEntity } from 'src/listens/entities/listen.entity';
import { PlaylistEntity } from 'src/playlists/entities/playlist.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false, type: 'boolean' })
  isAdmin: boolean;

  @Column({ default: false  , type: 'boolean'})
  blocked: boolean;

  @OneToMany(() => PlaylistEntity, (playlist) => playlist.user)
  playlists: PlaylistEntity[];

  @OneToMany(() => ListenRecordEntity, (listens) => listens.user)
  listenRecords: ListenRecordEntity[];
  
  @OneToMany(() => LikedMusicEntity, (likedMusic) => likedMusic.user)
  likedMusics: LikedMusicEntity[];

  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
