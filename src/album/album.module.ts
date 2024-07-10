import { Module } from "@nestjs/common";
import { AlbumService } from "./album.service";
import { AlbumRepository } from "./album.repository";
import { AlbumController } from "./album.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlbumEntity } from "./entities/album.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AlbumEntity])],
    controllers : [AlbumController],
    providers : [AlbumService, AlbumRepository]

})

export class AlbumModule {
    

}
