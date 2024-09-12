import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { AuthorsRepository } from './authors.repository';
import { FilesService } from 'src/files/files.service';
import { AuthorEntity } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly authorsRepository: AuthorsRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(
    createAuthorsDto: CreateAuthorsDto,
    picture: Express.Multer.File,
  ) {
    try {
      const { url: coverImgUrl } = await this.filesService.uploadFile(
        picture,
        'Images',
      );
      if (!coverImgUrl) {
        throw new Error('Failed to upload cover image');
      }
      return this.authorsRepository.create(createAuthorsDto, coverImgUrl);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create author');
    }
  }

  async findAll() {
    return await this.authorsRepository.findAll();
  }

  async findOne(id: number) {
    return await this.authorsRepository.findOne(id);
  }

  async update(id: number, picture: Express.Multer.File) {
    const { url: coverImgUrl } = await this.filesService.uploadFile(
      picture,
      'Images',
    );

    if (!coverImgUrl) {
      throw new InternalServerErrorException('Failed to upload cover image');
    }

    return await this.authorsRepository.update(id, coverImgUrl);
  }

  async getRecentlyAddedAuthors() {
    return await this.authorsRepository.recentlyAddedAuthors();
  }

  async findAuthorById(id: number): Promise<AuthorEntity> {
    const author = await this.authorsRepository.findOne(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  async remove(id: number) {
    const author = await this.authorsRepository.findOne(id);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    await this.authorsRepository.remove(id);

    return await this.authorsRepository.remove(id);
  }

  async updateAndGetTopAuthors() {
    await this.authorsRepository.updateAllAuthorsPlayCounts();
    return this.authorsRepository.topAuthors();
  }
}
