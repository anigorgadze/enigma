import { IsString } from "class-validator";

export class CreateTopchartDto {
    @IsString()
    title: string;
    
}
