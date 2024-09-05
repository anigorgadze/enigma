import { Repository } from "typeorm";
import { TopchartEntity } from "./entities/topchart.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTopchartDto } from "./dto/create-topchart.dto";
import { UpdateTopchartDto } from "./dto/update-topchart.dto";

@Injectable()
export class TopchartsRepository {
    constructor(
        @InjectRepository(TopchartEntity)
        private readonly topchartsRepository: Repository<TopchartEntity>,
    ) { }
    async create(createTopchartDto: CreateTopchartDto, coverImgUrl: string) {
        const newTopchart = new TopchartEntity();
        newTopchart.title = createTopchartDto.title;
        newTopchart.coverImgUrl = coverImgUrl;

        await this.topchartsRepository.save(newTopchart);

        return newTopchart;
    }
    async findAll() {
        return await this.topchartsRepository
            .createQueryBuilder('topchart')
            .getMany();
    }

    async findOne(id: number) {
        return await this.topchartsRepository
        .createQueryBuilder('topchart')
        .where('topchart.id = :id', { id })
        .getOne();
    }

    async update(id: number, updateTopchartDto: UpdateTopchartDto) {
        await this.topchartsRepository.update(id, updateTopchartDto);  
      
        return await this.topchartsRepository.findOne({ where: { id } }); 
      }

      async remove(id: number) {
        await this.topchartsRepository.softDelete(id); 

        return await this.topchartsRepository.findOne({
          where: { id },
          withDeleted: true,
        });
      }
}