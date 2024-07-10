import { IsDateString, IsString, IsUrl } from "class-validator";

export class CreateAlbumDto {
   
        @IsString()
        title: string;
    
        @IsDateString()
        releaseDate : Date;
    
        @IsUrl ({}, {each : true})
        musics : string[];
    
        @IsString()
        artistName: string;

        @IsUrl()
        coverUrl: string;
        
    }