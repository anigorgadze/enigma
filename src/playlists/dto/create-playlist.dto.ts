import { Optional } from '@nestjs/common';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePlaylistDto {
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    title: string;

    @IsNumber({}, { each: true })
    musicsIds: number[];

    @IsNumber()
    @Optional()
    userId: number;
}
