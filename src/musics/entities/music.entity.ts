import { PlaylistEntity } from 'src/playlists/entities/playlist.entity';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { AuthorEntity } from 'src/authors/entities/author.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}
