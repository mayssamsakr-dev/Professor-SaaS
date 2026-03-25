import { Test, TestingModule } from '@nestjs/testing';
import { TeachingSessionController } from './teaching-session.controller';

describe('TeachingSessionController', () => {
  let controller: TeachingSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachingSessionController],
    }).compile();

    controller = module.get<TeachingSessionController>(TeachingSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
