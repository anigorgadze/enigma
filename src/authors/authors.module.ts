import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { AuthorsRepository } from './authors.repository';
import { FilesModule } from 'src/files/files.module';



@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity]) , FilesModule],
  controllers: [AuthorsController],
  providers: [AuthorsService, AuthorsRepository],
  exports: [AuthorsRepository],
})
export class AuthorsModule {}
