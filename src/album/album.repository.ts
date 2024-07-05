import { Injectable } from "@nestjs/common";
import { CreateAlbumDto, UpdateAlbumDto } from "./dto/update-album.dto";

@Injectable()
export class AlbumRepository {

    private albums = []
    create(createAlbumDto: CreateAlbumDto) {
        const newAlbum = { id :  this.albums.length +1 , ...createAlbumDto}
        this.albums.push(newAlbum)
        return newAlbum
    } 

    findAll() {
        return this.albums
    }

    findOne( id : number) {
        for(let i = 0; i < this.albums.length; i++) {
            if( this.albums[i].id === Number(id))
            return this.albums[i]
        }
        return null
    }

    update(id : number, updateAlbumDto : UpdateAlbumDto) {
        for(let i = 0; i <  this.albums.length; i++) {
            if(this.albums[i].id === Number(id))  {
                const updatedAlbum = { ...this.albums[i], ...updateAlbumDto}
                this.albums[i] =updatedAlbum
                return updatedAlbum
            }
        }
        return null
    }

    remove(id : number) {
        for(let i = 0; i < this.albums.length; i++) {
            if( this.albums[i].id === Number(id)) {
                const removedAlbum = this.albums.splice(i , 1)
                return removedAlbum
            }
        }
        return null
    }
}