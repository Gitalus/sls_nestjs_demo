import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Handler, Context, Callback } from 'aws-lambda';
import serverless from 'serverless-http';

import { AppModule } from './app.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // app.useGlobalGuards(new AuthGuard());
  await app.init();

  const fastifyApp = app.getHttpAdapter().getInstance();
  return serverless(fastifyApp);
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server ??= await bootstrap();
  return server(event, context, callback);
};
