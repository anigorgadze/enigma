import { PlaylistEntity } from "src/playlists/entities/playlist.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'music'})
export class MusicEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    title: string;

    @Column({type: 'varchar'})
    coverImgUrl: string;

    @Column({type: 'varchar'})
    audioUrl: string;

    @ManyToMany(() => PlaylistEntity, (playlist) => playlist.musics)
    playlist: PlaylistEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
    

}


