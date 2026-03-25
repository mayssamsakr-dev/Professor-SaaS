import { Module } from '@nestjs/common';
import { UniversitySubjectService } from './university-subject.service';
import { UniversitySubjectController } from './university-subject.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UniversitySubjectController],
  providers: [UniversitySubjectService],
})
export class UniversitySubjectModule {}