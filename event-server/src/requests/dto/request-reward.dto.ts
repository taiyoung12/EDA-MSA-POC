import { IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class RequestRewardDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  eventId: string;

  @IsOptional()
  @IsObject()
  evidence?: Record<string, any>;
}
