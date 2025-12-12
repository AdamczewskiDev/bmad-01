import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(ThrottlerException)
export class ThrottleExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Określ endpoint i odpowiedni komunikat
    let message = 'Zbyt wiele prób. Spróbuj ponownie później.';
    
    if (request.url?.includes('/auth/login')) {
      message = 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.';
    } else if (request.url?.includes('/auth/register')) {
      message = 'Zbyt wiele prób rejestracji. Spróbuj ponownie za godzinę.';
    } else if (request.url?.includes('/auth/forgot-password')) {
      message = 'Zbyt wiele prób resetu hasła. Spróbuj ponownie za godzinę.';
    }

    response.status(HttpStatus.TOO_MANY_REQUESTS).json({
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      message,
      error: 'Too Many Requests',
    });
  }
}

