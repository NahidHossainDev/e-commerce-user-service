"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
const fs_1 = require("fs");
const app_module_1 = require("./app.module");
const config_1 = require("./config");
const response_1 = require("./utils/response");
function setupSwagger(app) {
    const options = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api/v1/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
        useGlobalPrefix: true,
    });
    if (config_1.config.exportSwagger === 'true') {
        (0, fs_1.writeFileSync)('openapi.json', JSON.stringify(document, null, 2));
        console.log('Swagger exported to openapi.json');
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Startup');
    app.use(cookieParser());
    app.enableCors({
        origin: config_1.config.env === 'production'
            ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
            : true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    setupSwagger(app);
    app.setGlobalPrefix('api/v1');
    app.useGlobalFilters(new response_1.GlobalExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: (errors) => new common_1.BadRequestException(errors),
    }));
    app.useGlobalInterceptors(new response_1.GlobalResponseTransformer());
    await app.listen(config_1.config.port);
    logger.log(`App Started on http://localhost:${config_1.config.port}/api/v1`);
    logger.log(`Swagger Docs on http://localhost:${config_1.config.port}/api/v1/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map