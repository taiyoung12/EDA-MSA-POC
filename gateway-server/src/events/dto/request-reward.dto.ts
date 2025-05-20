import { IsObject, IsOptional } from 'class-validator';

export class RequestRewardDto {
  @IsOptional()
  @IsObject()
  evidence?: object;
}
