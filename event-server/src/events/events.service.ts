import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = new this.eventModel(createEventDto);
    return newEvent.save();
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
    
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    
    return updatedEvent;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.eventModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    
    return { deleted: true };
  }

  async isEventActive(id: string): Promise<boolean> {
    const event = await this.findOne(id);
    const now = new Date();
    
    return (
      event.isActive &&
      new Date(event.startDate) <= now &&
      new Date(event.endDate) >= now
    );
  }

  async validateConditions(id: string, userData: any): Promise<boolean> {
    const event = await this.findOne(id);
    const conditions = event.conditions;
    
    // Here you would implement the validation logic for different condition types
    // For example: login streak, friend invitation, quest completion, etc.
    // This is a simplified example that just checks if all condition keys in userData match event conditions
    
    for (const key in conditions) {
      if (!userData[key] || userData[key] < conditions[key]) {
        return false;
      }
    }
    
    return true;
  }
}
