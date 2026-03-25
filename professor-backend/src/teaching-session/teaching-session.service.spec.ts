import { Test, TestingModule } from '@nestjs/testing';
import { TeachingSessionService } from './teaching-session.service';

describe('TeachingSessionService', () => {
  let service: TeachingSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeachingSessionService],
    }).compile();

    service = module.get<TeachingSessionService>(TeachingSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
