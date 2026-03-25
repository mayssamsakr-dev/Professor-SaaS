import { Test, TestingModule } from '@nestjs/testing';
import { UniversitySubjectService } from './university-subject.service';

describe('UniversitySubjectService', () => {
  let service: UniversitySubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniversitySubjectService],
    }).compile();

    service = module.get<UniversitySubjectService>(UniversitySubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
