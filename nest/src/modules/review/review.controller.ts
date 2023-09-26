import { Controller, Delete, Param } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('api/review')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  // @Post('/:eventId')
  // @Roles(userTypes.CUSTOMER)
  // async addEventReview(
  //   @Param('eventId') eventId: string,
  //   @Body('rating') rating: number,
  //   @Body('review') review: string,
  //   @Req() req: any,
  // ) {
  //   return await this.service.addEventReview(eventId, rating, review, req.user);
  // }

  @Delete('/:eventId/:reviewId')
  async removeEventReview(
    @Param('eventId') eventId: number,
    @Param('reviewId') reviewId: number,
  ) {
    return await this.service.removeEventReview(eventId, reviewId);
  }
}
