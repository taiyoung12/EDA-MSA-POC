import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RequestRewardDto } from './dto/request-reward.dto';
import { ProcessRequestDto } from './dto/process-request.dto';
import {
  RewardRequest,
  RewardRequestDocument,
} from './schemas/reward-request.schema';
import { RequestStatus } from './enums/request-status.enum';
import { EventsService } from '../events/events.service';
import { RewardsService } from '../rewards/rewards.service';
import { Document } from 'mongoose';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    private readonly eventsService: EventsService,
    private readonly rewardsService: RewardsService,
  ) {}

  async requestReward(
    requestRewardDto: RequestRewardDto,
  ): Promise<RewardRequest> {
    const { userId, eventId, evidence } = requestRewardDto;

    // Check if event is active
    const isEventActive = await this.eventsService.isEventActive(eventId);
    if (!isEventActive) {
      throw new BadRequestException('Event is not active');
    }

    // Check if user has already requested reward for this event
    const existingRequest = await this.rewardRequestModel
      .findOne({
        userId,
        eventId: new Types.ObjectId(eventId),
        status: { $in: [RequestStatus.APPROVED, RequestStatus.PROCESSED] },
      })
      .exec();

    if (existingRequest) {
      throw new BadRequestException(
        'You have already received a reward for this event',
      );
    }

    // Get rewards for the event
    const rewards = await this.rewardsService.findAllByEventId(eventId);
    if (rewards.length === 0) {
      throw new BadRequestException('No rewards defined for this event');
    }

    // Validate conditions based on evidence/user data
    const areConditionsMet = await this.eventsService.validateConditions(
      eventId,
      evidence || {},
    );

    // Create request with appropriate status
    const rewardIds = rewards.map((reward) => (reward as unknown as Document)._id);
    const status = areConditionsMet
      ? RequestStatus.PROCESSED // Auto-approve if conditions are met
      : RequestStatus.PENDING; // Requires manual approval

    const newRequest = new this.rewardRequestModel({
      userId,
      eventId: new Types.ObjectId(eventId),
      rewards: rewardIds,
      status,
      evidence: evidence || {},
      ...(areConditionsMet && {
        processedAt: new Date(),
        processedBy: 'SYSTEM',
      }),
    });

    return newRequest.save();
  }

  async getUserRewardHistory(userId: string): Promise<RewardRequest[]> {
    return this.rewardRequestModel
      .find({ userId })
      .populate('eventId')
      .populate('rewards')
      .exec();
  }

  async getAllRewardRequests(): Promise<RewardRequest[]> {
    return this.rewardRequestModel
      .find()
      .populate('eventId')
      .populate('rewards')
      .exec();
  }

  async processRequest(
    id: string,
    processRequestDto: ProcessRequestDto,
  ): Promise<RewardRequest> {
    const { status, rejectionReason, processedBy } = processRequestDto;

    const request = await this.rewardRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    // Cannot process already processed requests
    if (
      request.status === RequestStatus.APPROVED ||
      request.status === RequestStatus.PROCESSED
    ) {
      throw new BadRequestException('This request has already been processed');
    }

    request.status = status;
    request.processedAt = new Date();
    request.processedBy = processedBy;

    if (status === RequestStatus.REJECTED && rejectionReason) {
      request.rejectionReason = rejectionReason;
    }

    return request.save();
  }
}
