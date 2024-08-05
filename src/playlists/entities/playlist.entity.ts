import { MusicEntity } from "src/musics/entities/music.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'playlist'})
export class PlaylistEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    title: string;


    @ManyToMany(() => MusicEntity, (music) => music.playlist)
    @JoinTable()
    musics: MusicEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
