import { IsNumber } from 'class-validator';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { MusicEntity } from 'src/musics/entities/music.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'author' })
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  artistName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'longtext' })
  biography: string;

  @Column({ nullable: true })
  releaseDate: string;

  @Column({ type: 'varchar' })
  coverImgUrl: string;

  @Column({ nullable: true })
  userId: number;

  @Column()
  musicsCount: number;

  @Column({ type: 'int', default: 0 })
  totalPlayCount: number;

  @ManyToMany(() => MusicEntity, (music) => music.authors, { cascade: true })
  @JoinTable()
  musics: MusicEntity[];

  @ManyToMany(() => AlbumEntity, (albums) => albums.authors, {
    cascade: ['soft-remove'],
    onDelete: 'CASCADE',
  })
  albums: AlbumEntity[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;
}
