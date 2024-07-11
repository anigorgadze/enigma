import { Injectable } from "@nestjs/common";
import { UpdateAlbumsDto } from "./dto/update-albums.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AlbumEntity } from "./entities/album.entity";
import { Repository } from "typeorm";
import { CreateAlbumsDto } from "./dto/create-albums.dto";


@Injectable()
export class AlbumsRepository {
    constructor(
        @InjectRepository(AlbumEntity)
        private albumsRepository : Repository <AlbumEntity>
    ){}

    async create(createAlbumsDto: CreateAlbumsDto) {
        const newAlbum = this.albumsRepository.create(createAlbumsDto)
        return await this.albumsRepository.save(newAlbum)
    }

    async findAll() {
        return await  this.albumsRepository
        .createQueryBuilder('album')
        .getMany()

    }

    async findOne(id: number) {
        return await this.albumsRepository
        .createQueryBuilder('album')
        .where('album.id =:id', {id})
        .getOne()
    }

    async update(id: number, updateAlbumDto: UpdateAlbumsDto){        
        await this.albumsRepository
        .createQueryBuilder('album')
        .update()
        .set(updateAlbumDto)
        .where('album.id =:id' , {id})
        .execute()

        return await this.albumsRepository
        .createQueryBuilder('album')
        .where('album.id =:id' , {id})
        .getOne()
    }

    async remove(id: number){
        await this.albumsRepository
        .createQueryBuilder('album')
        .where('album.id =:id' , {id})
        .softDelete()
        .execute()

        return await this.albumsRepository
        .createQueryBuilder('album')
        .withDeleted()
        .where('album.id =:id',{id})
        .getOne()
    }
    }