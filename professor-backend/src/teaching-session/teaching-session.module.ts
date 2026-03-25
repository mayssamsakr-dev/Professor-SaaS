import { Module } from '@nestjs/common';
import { TeachingSessionService } from './teaching-session.service';
import { TeachingSessionController } from './teaching-session.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeachingSessionController],
  providers: [TeachingSessionService],
})
export class TeachingSessionModule {}