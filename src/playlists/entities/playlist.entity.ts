import { MusicEntity } from 'src/musics/entities/music.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'playlist' })
export class PlaylistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @ManyToMany(() => MusicEntity, (music) => music.playlist)
  @JoinTable()
  musics: MusicEntity[]; 

  @ManyToOne(() => UserEntity , (user) => user.playlists) 
  user: UserEntity;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
