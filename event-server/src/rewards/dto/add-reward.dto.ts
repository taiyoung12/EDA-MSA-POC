import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { RewardType } from '../enums/reward-type.enum';

export class AddRewardDto {
  @IsNotEmpty()
  @IsEnum(RewardType)
  type: RewardType;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
