import { IsNumber } from "class-validator";
import { type } from "os";
import { AuthorEntity } from "src/authors/entities/author.entity";
import { MusicEntity } from "src/musics/entities/music.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'album'})
export class AlbumEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    title: string;

    @Column({type: 'date'})
    releaseDate: Date;

    @Column({type: 'varchar'})
    artistName: string;

    @Column({type: 'varchar'})
    coverUrl: string;

    @ManyToMany(() => MusicEntity, (music)=> music.albums, {cascade:true})
    @JoinTable()
    musics: MusicEntity[]

    @ManyToMany(() => AuthorEntity , (author) => author.albums , {cascade: true})
    @JoinTable()
    authors: AuthorEntity[]
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}