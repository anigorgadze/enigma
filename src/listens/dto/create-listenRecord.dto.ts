import { IsNumber } from 'class-validator';

export class CreateListenRecordDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  musicId: number;
}
