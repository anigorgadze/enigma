import { IsNumber } from 'class-validator';

export class CreateListenRecordDto {
  @IsNumber()
  musicId: number;
}
