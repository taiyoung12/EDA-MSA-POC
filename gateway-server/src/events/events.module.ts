import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
