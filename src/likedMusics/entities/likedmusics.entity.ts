import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { MusicEntity } from 'src/musics/entities/music.entity';

@Entity({ name: 'liked_music' })
@Unique(['user', 'music'])
export class LikedMusicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.likedMusics)
  user: UserEntity;

  @ManyToOne(() => MusicEntity, (music) => music.likedByUsers)
  music: MusicEntity;
}
