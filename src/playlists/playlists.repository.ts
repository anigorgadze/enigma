import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PlaylistEntity } from "./entities/playlist.entity";
import { Repository } from "typeorm";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { UpdatePlaylistDto } from "./dto/update-playlist.dto";

@Injectable()
export class PlaylistsRepository {
    constructor(@InjectRepository(PlaylistEntity)
                private readonly playlistRepository : Repository <PlaylistEntity>) {}
    async create(createPlaylistDto: CreatePlaylistDto) {
        const newPlaylist =  this.playlistRepository.create(createPlaylistDto)
        return await this.playlistRepository.save(newPlaylist)
    } 
    
    async findAll() {
        return await this.playlistRepository.find()
    }

    async findOne(id: number) {
        return await this.playlistRepository
        .createQueryBuilder('playlist')
        .where('playlist.id =:id' , {id})
        .getOne()
    }

    async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
        await this.playlistRepository
        .createQueryBuilder('playlist')
        .update()
        .set(updatePlaylistDto)
        .where('playlist.id =:id' , {id})
        .execute()

        return this.playlistRepository
        .createQueryBuilder('playlist')
        .where('playlist.id =:id' , {id})
        .getOne()
    }


    async remove(id: number) {
        await this.playlistRepository
          .createQueryBuilder('playlist')
          .where('playlist.id =:id', { id })
          .softDelete()
          .execute();
    
        return await this.playlistRepository
          .createQueryBuilder('playlist')
          .withDeleted()
          .where('playlist.id =:id', { id })
          .getOne();
      }

}