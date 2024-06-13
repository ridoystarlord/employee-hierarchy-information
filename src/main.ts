import * as notReallyCluster from 'cluster';
import { availableParallelism } from 'os';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';
import corsOptions from './utils/cors';
import Logger from './utils/logger';

const cluster = notReallyCluster as unknown as notReallyCluster.Cluster;
const numCPUs = availableParallelism();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.enableCors(corsOptions);
  app.use(helmet());
  const morganFormat = ':method :url :status :response-time ms';
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(' ')[0],
            url: message.split(' ')[1],
            status: message.split(' ')[2],
            responseTime: message.split(' ')[3],
          };
          Logger.info(JSON.stringify(logObject));
        },
      },
    }),
  );
  app.use(compression());
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Employee Hierarchy Information')
    .setDescription('Api Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT);
}

if (cluster.isPrimary) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); //fork new worker
  });
} else {
  bootstrap();
  console.log(`Worker ${process.pid} started`);
}
