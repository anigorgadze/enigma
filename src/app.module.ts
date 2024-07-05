import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumRepository } from './album/album.repository';
import { AlbumModule } from './album/album.module';
import { AuthorModule } from './author/author.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MusicModule, UsersModule,AuthorModule,AlbumModule],
  controllers: [AppController],
  providers: [AppService],
    
})
export class AppModule {}
