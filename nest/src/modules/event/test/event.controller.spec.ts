import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from 'src/modules/event/event.controller';
import { EventService } from 'src/modules/event/event.service';
import { CreateEventDto } from '../dto/create-event.dto';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  beforeEach(async () => {
    const mockService = {
      createEvent: jest.fn(),
      findAllEvents: jest.fn(),
      findOneEvent: jest.fn(),
      updateEvent: jest.fn(),
      removeEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const dto: CreateEventDto = {
        eventName: 'test',
        description: 'test',
        startDate: new Date(),
        endDate: new Date(),
        location: 'test',
        image: 'test',
      };
      await controller.create(dto);
      expect(service.createEvent).toHaveBeenCalledWith(dto);
    });
  });
});
