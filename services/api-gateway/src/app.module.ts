import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { CoursesController } from './courses/courses.controller';
import { LessonsController } from './lessons/lessons.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    ClientsModule.registerAsync([
      {
        name: 'LMS_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('LMS_SERVICE_HOST', 'localhost'),
            port: configService.get('LMS_SERVICE_PORT', 8001),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'SIMILAR_COURSES_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('SIMILAR_COURSES_SERVICE_HOST', 'localhost'),
            port: configService.get('SIMILAR_COURSES_SERVICE_PORT', 8002),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    
    AuthModule,
  ],
  controllers: [
    AuthController,
    CoursesController,
    LessonsController,
    UsersController,
  ],
})
export class AppModule {}