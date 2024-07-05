import { Injectable } from "@nestjs/common";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { UpdateAuthorDto } from "./dto/update-author.dto";

@Injectable()
export class AuthorRepository {

    private authors = []

    create(createAuthorDto: CreateAuthorDto) {
        const newAuthor = { id: this.authors.length + 1, ...createAuthorDto };
        this.authors.push(newAuthor)
        return newAuthor
    }

    findAll() {
        return this.authors
    }

    findOne(id: number) {
        for (let i = 0; i < this.authors.length; i++) {
            if (this.authors[i].id === Number(id)) {
                return this.authors[i]
            }
            
        }
        return null
    }

    update(id: number, updatedAuthorDto: UpdateAuthorDto) {
        for (let i = 0; i < this.authors.length; i++) {
            if (this.authors[i].id === Number(id)) {
                const updatedAuthor = { ...this.authors[i], ...updatedAuthorDto }
                this.authors[i] = updatedAuthor;
                return updatedAuthor
            }
        }
        return null
    }

    remove(id: number) {
        for (let i = 0; i < this.authors.length; i++) {
            if (this.authors[i].id === Number(id)) {
                const [removedAuthor] = this.authors.splice(i, 1);
                return removedAuthor
            }
        }
        return null   
    }
}