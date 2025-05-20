import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AddRewardDto } from './dto/add-reward.dto';
import { RequestRewardDto } from './dto/request-reward.dto';

@Controller('events')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll() {
    return this.eventsService.findAllEvents();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findEventById(id);
  }

  @Post()
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Put(':id')
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }

  @Post(':id/rewards')
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  async addReward(
    @Param('id') id: string,
    @Body() addRewardDto: AddRewardDto,
  ) {
    return this.eventsService.addReward(id, addRewardDto);
  }

  @Post(':id/request')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async requestReward(
    @Param('id') id: string,
    @Body() requestRewardDto: RequestRewardDto,
    @Request() req,
  ) {
    return this.eventsService.requestReward(id, requestRewardDto, req.user);
  }

  @Get('rewards/history')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getRewardHistory(@Request() req) {
    return this.eventsService.getRewardHistory(req.user);
  }

  @Get('rewards/audit')
  @Roles(UserRole.AUDITOR, UserRole.ADMIN)
  async auditRewards() {
    return this.eventsService.auditRewards();
  }
}
