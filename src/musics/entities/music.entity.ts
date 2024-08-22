import { PlaylistEntity } from 'src/playlists/entities/playlist.entity';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { AuthorEntity } from 'src/authors/entities/author.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ListenRecordEntity } from 'src/listens/entities/listen.entity';

@Entity({ name: 'music' })
export class MusicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  coverImgUrl: string;

  @Column({ type: 'varchar' })
  audioUrl: string;

  @Column({ type: 'int', default: 0 })
  playCount: number;

  @OneToMany(() => ListenRecordEntity, (listens) => listens.music)
  listenRecords: ListenRecordEntity[];

  @ManyToMany(() => AlbumEntity, (album) => album.musics)
  albums: AlbumEntity[];

  @ManyToMany(() => AuthorEntity, (author) => author.musics)
  authors: AuthorEntity[];

  @ManyToMany(() => PlaylistEntity, (playlist) => playlist.musics)
  playlist: PlaylistEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
  musics: any;
}
