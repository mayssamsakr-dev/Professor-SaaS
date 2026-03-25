import { Test, TestingModule } from '@nestjs/testing';
import { ServiceActivityController } from './service-activity.controller';

describe('ServiceActivityController', () => {
  let controller: ServiceActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceActivityController],
    }).compile();

    controller = module.get<ServiceActivityController>(ServiceActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
