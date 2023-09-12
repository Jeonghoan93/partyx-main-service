import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from '../cloudinary.service';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((options, callback) =>
        callback(null, { secure_url: 'test_url' }),
      ),
    },
  },
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  let mockFile: any;

  beforeEach(async () => {
    mockFile = {
      originalname: 'test.jpg',
      buffer: Buffer.from('test buffer'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload image and return secure url', async () => {
    const result = await service.uploadImage(mockFile);
    expect(result).toHaveProperty('secure_url');
  });
});
