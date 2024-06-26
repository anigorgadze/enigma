import { IsDateString, IsString, IsUrl } from "class-validator";

export class CreateAlbumDto {
   

        @IsString()
        title: string;
    
        @IsDateString()
        releaseDate : string;
    
    
        @IsUrl ({}, {each : true})
        musics : string[];
    

        @IsString()
        artistName : string;
    }