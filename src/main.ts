import { NestFactory } from '@nestjs/core';
import { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

import { AppModule } from './app.module';

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  /* This works fine if we don't have any dependencies to inject */
  // app.useGlobalGuards(new AuthGuard());
  // app.userGlobalInterceptor(new LoggerInterceptor());
  // app.useGlobalPipes(new FreezePipe());
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

bootstrap();
