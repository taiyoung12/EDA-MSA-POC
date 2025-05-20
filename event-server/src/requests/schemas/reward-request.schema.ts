import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RequestStatus } from '../enums/request-status.enum';

export type RewardRequestDocument = RewardRequest & Document;

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Reward' }] })
  rewards: MongooseSchema.Types.ObjectId[];

  @Prop({ 
    required: true,
    enum: Object.values(RequestStatus),
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  evidence: Record<string, any>;

  @Prop()
  rejectionReason: string;

  @Prop()
  processedAt: Date;

  @Prop()
  processedBy: string;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
