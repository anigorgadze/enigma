import { type } from "os";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
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

    @Column({type : "simple-array" , nullable : true})
    musics: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}