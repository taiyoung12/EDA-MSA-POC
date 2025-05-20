import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestRewardDto } from './dto/request-reward.dto';
import { ProcessRequestDto } from './dto/process-request.dto';

@Controller()
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post('events/:eventId/request')
  async requestReward(
    @Param('eventId') eventId: string,
    @Body() requestRewardDto: RequestRewardDto,
  ) {
    return this.requestsService.requestReward({
      ...requestRewardDto,
      eventId,
    });
  }

  @Get('rewards/history')
  async getUserRewardHistory(@Query('userId') userId: string) {
    return this.requestsService.getUserRewardHistory(userId);
  }

  @Get('rewards/audit')
  async getAllRewardRequests() {
    return this.requestsService.getAllRewardRequests();
  }

  @Put('rewards/requests/:id/process')
  async processRequest(
    @Param('id') id: string,
    @Body() processRequestDto: ProcessRequestDto,
  ) {
    return this.requestsService.processRequest(id, processRequestDto);
  }
}
