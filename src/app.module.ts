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
import { FilesModule } from './files/files.module';
import 'dotenv/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { ListenRecordsModule } from './listens/listens.module';
import { TopchartsModule } from './topcharts/topcharts.module';
import { TikTokAuthModule } from './tiktok/tiktok.auth.module';
import { TikTokModule } from './tiktok/tiktok.module';

@Module({
  imports: [
    MusicsModule,
    UsersModule,
    AuthorsModule,
    AlbumsModule,
    TikTokAuthModule,
    TikTokModule,
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
    FilesModule,
    AuthModule,
    ListenRecordsModule,
    TopchartsModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard, Reflector],
})
export class AppModule {}
