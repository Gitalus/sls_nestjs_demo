import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, tap } from 'rxjs';
import { RequestService } from 'src/request.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly requestService: RequestService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const userAgent = request.raw.headers['user-agent'] || ''; // client name?
    const { url } = request.raw;
    const { ip, method } = request;

    this.logger.log(`
      ${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${
      context.getHandler().name
    } invoked...
    `);

    this.logger.debug('userId', this.requestService.getUserId());

    const now = Date.now();
    return next.handle().pipe(
      // pipe the response from the handler
      tap((res) => {
        const response: FastifyReply = context.switchToHttp().getResponse();

        const { statusCode } = response;
        const contentLength = response.getHeader('content-length');

        this.logger.log(`
        ${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}: ${
          Date.now() - now
        }ms
        `);

        this.logger.debug('Response:', res);
      }),
    );
  }
}
