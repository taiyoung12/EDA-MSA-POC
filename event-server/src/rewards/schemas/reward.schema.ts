import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RewardType } from '../enums/reward-type.enum';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({ 
    required: true, 
    enum: Object.values(RewardType) 
  })
  type: RewardType;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  quantity: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
