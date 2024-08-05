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

  @Column({type:'varchar'})
  name: string;

  @Column({ nullable: true })
  releaseDate: Date;

  @Column({nullable:true})
  imgUrl: string;

  @Column({ nullable: true })
  userId: number;

  @ManyToMany(() => MusicEntity, (music) => music.authors , {cascade:true})
  @JoinTable()
  musics: MusicEntity[];
  
  @ManyToMany(()=> AlbumEntity , (albums) => albums.authors)
  albums: AlbumEntity[]

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;
}
