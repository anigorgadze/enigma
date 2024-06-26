import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumRepository } from './album/album.repository';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [AlbumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
