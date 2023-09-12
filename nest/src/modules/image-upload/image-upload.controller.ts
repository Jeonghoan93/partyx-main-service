import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/middleware/role.decorators';
import { userTypes } from 'src/common/types';
import { CloudinaryService } from './cloudinary.service';

@Controller('api/image-upload')
export class ImageUploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('cloudinary')
  @UseInterceptors(FileInterceptor('file'))
  async uploadToCloudinary(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFromBuffer(file);

    if (result.status === 'success') {
      return result;
    } else {
      throw new BadRequestException(result.error || 'Image upload failed!');
    }
  }

  @Post('/:id/image')
  @Roles(userTypes.ADMIN)
  @UseInterceptors(
    FileInterceptor('EventImage', {
      dest: 'cloudinary/assets/',
      limits: {
        fileSize: 3145728, // 3 MB
      },
    }),
  )
  async uploadEventImage(
    @Param('id') id: string,
    @UploadedFile() file: ParameterDecorator,
  ) {
    return await this.cloudinaryService.uploadEventImage(id, file);
  }
}
