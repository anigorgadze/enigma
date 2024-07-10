import { Injectable } from "@nestjs/common";
import { CreateAlbumDto, UpdateAlbumDto } from "./dto/update-album.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AlbumEntity } from "./entities/album.entity";
import { Repository } from "typeorm";


@Injectable()
export class AlbumRepository {
    constructor(
        @InjectRepository(AlbumEntity)
        private albumRepository : Repository <AlbumEntity>
    ){}

    async create(createAlbumDto: CreateAlbumDto) {
        const newAlbum = this.albumRepository.create(createAlbumDto)
        return await this.albumRepository.save(newAlbum)
    }

    async findAll() {
        return await  this.albumRepository
        .createQueryBuilder('album')
        .getMany()

    }

    async findOne(id: number) {
        return await this.albumRepository
        .createQueryBuilder('album')
        .where('album.id =:id', {id})
        .getOne()
    }

    async update(id: number, updateAlbumDto: UpdateAlbumDto){        
        await this.albumRepository
        .createQueryBuilder('album')
        .update()
        .set(updateAlbumDto)
        .where('id =:id' , {id})
        .execute()

        return await this.albumRepository
        .createQueryBuilder('album')
        .where('album.id =:id' , {id})
        .getOne()
    }

    async remove(id: number){
        await this.albumRepository
        .createQueryBuilder()
        .where('id =:id' , {id})
        .softDelete()
        .execute()

        return await this.albumRepository
        .createQueryBuilder('album')
        .withDeleted()
        .where('album.id =:id',{id})
        .getOne()
    }
    }