import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { startPing } from './ping/ping';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  const reflector = app.get(Reflector);

  // app
  //   .useGlobalGuards
  //   // new JwtAuthGuard(reflector),
  //   // new RolesGuard(reflector),
  //   ();
  const port = process.env.PORT || 8080;
  await app.listen(port);

  startPing();
}
bootstrap();
