import {
  BadRequestException,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';
import { config } from './config';
import {
  GlobalExceptionFilter,
  GlobalResponseTransformer,
} from './utils/response';

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('User Service API Operations')
    .setDescription('Auth service http API docs')
    .addBearerAuth({
      description: 'User JWT token',
      type: 'http',
      name: 'Authorization',
      bearerFormat: 'JWT',
    })
    .setVersion('1.0')
    .addServer('/api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    useGlobalPrefix: true,
  });

  if (config.exportSwagger === 'true') {
    writeFileSync('openapi.json', JSON.stringify(document, null, 2));
    console.log('Swagger exported to openapi.json');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Startup');
  app.enableCors();

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport:Transport.NATS,
  //   options:{
  //     queue:'blog-post',
  //     servers
  //   }
  // })

  // app.startAllMicroservices()

  setupSwagger(app);
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  app.useGlobalInterceptors(new GlobalResponseTransformer());

  await app.listen(config.port);

  logger.log(`App Started on http://localhost:${config.port}/api/v1`);
  logger.log(`Swagger Docs on http://localhost:${config.port}/api/v1/docs`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
