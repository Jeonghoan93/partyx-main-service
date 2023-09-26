import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { EventRepository } from 'src/common/repos/event.repo';
import { StripeService } from '../payment/stripe.service';

type UploadResponse = {
  status: string;
  result?: any;
  error?: any;
};

@Injectable()
export class CloudinaryService {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventDB: EventRepository,
    private readonly stripeService: StripeService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('cloudinary.cloud_name'),
      api_key: this.configService.get('cloudinary.api_key'),
      api_secret: this.configService.get('cloudinary.api_secret'),
    });
  }

  async uploadEventImage(eventId: string, file: any): Promise<any> {
    try {
      const event = await this.eventDB.findOne({ _id: eventId });

      if (!event) {
        throw new Error('Event does not exist');
      }
      if (event.img) {
        await this.deleteImage(event.img);
      }

      // const resOfCloudinary = await this.uploadFromFilepath(file.path);
      // unlinkSync(file.path);
      // await this.eventDB.updateOneById(event.eventId, {
      //   img: resOfCloudinary,
      //   image: resOfCloudinary.secure_url,
      // });

      // await this.stripeService.updateStripeProductById(event.eventId, {
      //   images: [resOfCloudinary.secure_url],
      // });

      return 'TODO';
    } catch (error) {
      throw error;
    }
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await cloudinary.uploader.destroy(publicId, {
          invalidate: true,
        });
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  async uploadFromFilepath(file: Express.Multer.File): Promise<any> {
    return await cloudinary.uploader.upload(file.path, {
      folder: this.configService.get('cloudinary.folder'),
      public_id: `${this.configService.get(
        'cloudinary.publicId_prefix',
      )}${Date.now()}`,
      transformation: [
        {
          width: this.configService
            .get('cloudinary.bigSize')
            .toString()
            .split('X')[0],
          height: this.configService
            .get('cloudinary.bigSize')
            .toString()
            .split('X')[1],
          crop: 'fill',
        },
        { quality: 'auto' },
      ],
    });
  }

  async uploadFromBuffer(file: Express.Multer.File): Promise<UploadResponse> {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'partyx-images',
              allowed_formats: ['jpg', 'png'],
              public_id: `${Date.now()}`,
            },
            (err, uploadResult) => {
              if (err) reject(err);
              else resolve(uploadResult);
            },
          )
          .end(file.buffer);
      });

      return {
        status: 'success',
        result: result,
      };
    } catch (err) {
      return {
        status: 'error',
        error: err,
      };
    }
  }
}
