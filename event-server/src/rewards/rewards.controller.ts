import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { AddRewardDto } from './dto/add-reward.dto';

@Controller('events/:eventId/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  async findAllByEvent(@Param('eventId') eventId: string) {
    return this.rewardsService.findAllByEventId(eventId);
  }

  @Post()
  async addReward(
    @Param('eventId') eventId: string,
    @Body() addRewardDto: AddRewardDto,
  ) {
    return this.rewardsService.addReward(eventId, addRewardDto);
  }

  @Delete(':id')
  async removeReward(@Param('id') id: string) {
    return this.rewardsService.removeReward(id);
  }
}
