import { Test, TestingModule } from '@nestjs/testing';
import { UniversitySubjectController } from './university-subject.controller';

describe('UniversitySubjectController', () => {
  let controller: UniversitySubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniversitySubjectController],
    }).compile();

    controller = module.get<UniversitySubjectController>(UniversitySubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
