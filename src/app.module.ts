import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [MusicModule, UsersModule,AuthorModule],
  controllers: [AppController],
  providers: [AppService],
    
})
export class AppModule {}
