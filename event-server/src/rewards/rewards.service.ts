import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddRewardDto } from './dto/add-reward.dto';
import { Reward, RewardDocument } from './schemas/reward.schema';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async findAllByEventId(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find({ eventId: new Types.ObjectId(eventId) }).exec();
  }

  async findOneById(id: string): Promise<Reward> {
    const reward = await this.rewardModel.findById(id).exec();
    if (!reward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return reward;
  }

  async addReward(eventId: string, addRewardDto: AddRewardDto): Promise<Reward> {
    const newReward = new this.rewardModel({
      ...addRewardDto,
      eventId: new Types.ObjectId(eventId),
    });
    return newReward.save();
  }

  async removeReward(id: string): Promise<{ deleted: boolean }> {
    const result = await this.rewardModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    
    return { deleted: true };
  }
}
