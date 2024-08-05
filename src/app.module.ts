import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumsModule } from './albums/albums.module';
import { UsersModule } from './users/users.module';
import { MusicsModule } from './musics/musics.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from './authors/authors.module';
import { SearchModule } from './search/search.module';
import { PlaylistsModule } from './playlists/playlists.module';
import 'dotenv/config';

@Module({
  imports: [
    MusicsModule,
    UsersModule,
    AuthorsModule,
    AlbumsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST_NAME || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      username: process.env.MYSQL_USERNAME || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_NAME || 'enigma',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SearchModule,
    PlaylistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
