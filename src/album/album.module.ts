import { Module } from "@nestjs/common";
import { AlbumService } from "./album.servic";
import { AlbumRepository } from "./album.repository";
import { AlbumController } from "./album.controller";

@Module({

    controllers : [AlbumController],
    providers : [AlbumService, AlbumRepository]

})

export class AlbumModule {
    

}
