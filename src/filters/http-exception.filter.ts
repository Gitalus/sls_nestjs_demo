import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch(HttpException) // empty if you want to catch every exception regardles of the type
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /* Remember that nestjs catch everything and send them like a response, this catch and parse it */
  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.log(HttpExceptionFilter.name);

    const ctx = host.switchToHttp();

    // TODO: This may break after switching to fastify. Need fix
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
