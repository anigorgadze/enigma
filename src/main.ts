import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as https from 'https';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

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
    allowedHeaders: 'Content-Type,Accept',
  });
  const reflector = app.get(Reflector);

  app
    .useGlobalGuards
    // new JwtAuthGuard(reflector),
    // new RolesGuard(reflector),
    ();
    const port = process.env.PORT || 8080; 
    await app.listen(port);

      setInterval(() => {
        https.get('https://enigma-wtuc.onrender.com');
      }, 60000);
}
bootstrap();
