import { Module } from "@nestjs/common";
import { AlbumsService } from "./albums.service";
import { AlbumsRepository } from "./albums.repository";
import { AlbumsController } from "./albums.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlbumEntity } from "./entities/album.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AlbumEntity])],
    controllers : [AlbumsController],
    providers : [AlbumsService, AlbumsRepository]

})

export class AlbumsModule {
    

}
