import { PartialType } from '@nestjs/mapped-types';
import { CreateMusicsDto } from './create-musics.dto';

export class UpdateMusicsDto extends PartialType(CreateMusicsDto) {}