import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePlaylistDto {

    @IsString()
    @MinLength(1)
    @MaxLength(30)
    title: string;


    @IsNumber()
    musicId: number

}

