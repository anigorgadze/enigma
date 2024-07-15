import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;
}
