import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AddRewardDto } from './dto/add-reward.dto';
import { RequestRewardDto } from './dto/request-reward.dto';
import { AxiosError } from 'axios';

@Injectable()
export class EventsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private get eventServiceUrl() {
    return this.configService.get<string>('EVENT_SERVICE_URL');
  }

  async findAllEvents() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.eventServiceUrl}/events`).pipe(
          catchError((error: AxiosError) => {
            throw error.response?.data || error;
          }),
        ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findEventById(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.eventServiceUrl}/events/${id}`).pipe(
          catchError((error: AxiosError) => {
            throw error.response?.data || error;
          }),
        ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createEvent(createEventDto: CreateEventDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(`${this.eventServiceUrl}/events`, createEventDto)
          .pipe(
            catchError((error: AxiosError) => {
              throw error.response?.data || error;
            }),
          ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .put(`${this.eventServiceUrl}/events/${id}`, updateEventDto)
          .pipe(
            catchError((error: AxiosError) => {
              throw error.response?.data || error;
            }),
          ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteEvent(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.delete(`${this.eventServiceUrl}/events/${id}`).pipe(
          catchError((error: AxiosError) => {
            throw error.response?.data || error;
          }),
        ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async addReward(id: string, addRewardDto: AddRewardDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(`${this.eventServiceUrl}/events/${id}/rewards`, addRewardDto)
          .pipe(
            catchError((error: AxiosError) => {
              throw error.response?.data || error;
            }),
          ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async requestReward(
    id: string,
    requestRewardDto: RequestRewardDto,
    user: any,
  ) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(`${this.eventServiceUrl}/events/${id}/request`, {
            ...requestRewardDto,
            userId: user.id,
          })
          .pipe(
            catchError((error: AxiosError) => {
              throw error.response?.data || error;
            }),
          ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getRewardHistory(user: any) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.eventServiceUrl}/rewards/history?userId=${user.id}`)
          .pipe(
            catchError((error: AxiosError) => {
              throw error.response?.data || error;
            }),
          ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async auditRewards() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.eventServiceUrl}/rewards/audit`).pipe(
          catchError((error: AxiosError) => {
            throw error.response?.data || error;
          }),
        ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
