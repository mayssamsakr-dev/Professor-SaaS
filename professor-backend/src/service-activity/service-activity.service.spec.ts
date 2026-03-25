import { Test, TestingModule } from '@nestjs/testing';
import { ServiceActivityService } from './service-activity.service';

describe('ServiceActivityService', () => {
  let service: ServiceActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceActivityService],
    }).compile();

    service = module.get<ServiceActivityService>(ServiceActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
