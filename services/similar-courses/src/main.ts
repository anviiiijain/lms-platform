import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: 8002 },
    },
  );
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  await app.listen();
  console.log('Similar Courses Service on TCP 8002');
}
bootstrap();