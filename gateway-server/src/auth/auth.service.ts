import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AxiosError } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async register(registerDto: RegisterDto) {
    const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${authServiceUrl}/users/register`, registerDto)
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

  async login(loginDto: LoginDto) {
    const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${authServiceUrl}/users/login`, loginDto)
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

  async validateToken(token: string) {
    const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${authServiceUrl}/users/validate`, { token })
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
}
