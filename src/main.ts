import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
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
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new GlobalResponseTransformer());

  await app.listen(config.port);

  logger.log(`App Started on http://localhost:${config.port}/api`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
