import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumsModule } from './albums/albums.module';
import { AuthorModule } from './author/author.module';
import { UsersModule } from './users/users.module';
import { MusicsModule } from './musics/musics.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [MusicsModule, UsersModule,AuthorModule,AlbumsModule, TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username:'root',
    password: '',
    database: 'enigma',
    autoLoadEntities :true,
    synchronize: true
  })],
  controllers: [AppController],
  providers: [AppService],
    
})
export class AppModule {}
