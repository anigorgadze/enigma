import { Injectable } from "@nestjs/common";
import { AuthorRepository } from "./author.repository";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { create } from "domain";
import { UpdateAuthorDto } from "./dto/update-author.dto";

@Injectable() 
export class AuthorService {

    constructor(private readonly authorRepository : AuthorRepository) {

    }
    create(createAuthorDto : CreateAuthorDto) {
        return  this.authorRepository.create(createAuthorDto) 
    }

    findAll() {
        return this.authorRepository.findAll()
    }

    findOne( id : number) {

        return this.authorRepository.findOne(id)
    }

    update( id: number ,  updateAuthorDto : UpdateAuthorDto)  {
        return this.authorRepository.update(id, updateAuthorDto)
    }

    remove ( id: number) {
        return this.authorRepository.remove(id)
    }
}