import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from '../enums/request-status.enum';

export class ProcessRequestDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsString()
  processedBy: string;
}
