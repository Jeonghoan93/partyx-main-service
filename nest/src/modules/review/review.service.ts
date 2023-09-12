import { BadRequestException, Injectable } from '@nestjs/common';
import { EventRepository } from 'src/common/repos/event.repo';

@Injectable()
export class ReviewService {
  constructor(
    private readonly eventDB: EventRepository,
    private readonly ticketDB: EventRepository,
  ) {}

  async addEventReview(
    eventId: string,
    rating: number,
    review: string,
    user: Record<string, any>,
  ) {
    try {
      const event = await this.eventDB.findOne({ _id: eventId });
      if (!event) {
        throw new Error('Event does not exist');
      }

      if (
        event.feedbackDetails.find(
          (value: { customerId: string }) =>
            value.customerId === user._id.toString(),
        )
      ) {
        throw new BadRequestException(
          'You have already gave the review for this event',
        );
      }

      const ticket = await this.ticketDB.findOne({
        customerId: user._id,
        'ticketedItems.eventId': eventId,
      });

      if (!ticket) {
        throw new BadRequestException('You have not purchased this event');
      }

      const ratings: any[] = [];
      event.feedbackDetails.forEach((comment: { rating: any }) =>
        ratings.push(comment.rating),
      );

      let avgRating = String(rating);
      if (ratings.length > 0) {
        avgRating = (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(
          2,
        );
      }

      const reviewDetails = {
        rating: rating,
        feedbackMsg: review,
        customerId: user._id,
        customerName: user.name,
      };

      const result = await this.eventDB.findOneAndUpdate(
        { _id: eventId },
        { $set: { avgRating }, $push: { feedbackDetails: reviewDetails } },
      );

      return {
        message: 'Event review added successfully',
        success: true,
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeEventReview(eventId: string, reviewId: string) {
    try {
      const event = await this.eventDB.findOne({ _id: eventId });
      if (!event) {
        throw new Error('Event does not exist');
      }

      const review = event.feedbackDetails.find(
        (review) => review._id == reviewId,
      );
      if (!review) {
        throw new Error('Review does not exist');
      }

      const ratings: any[] = [];
      event.feedbackDetails.forEach((comment) => {
        if (comment._id.toString() !== reviewId) {
          ratings.push(comment.rating);
        }
      });

      let avgRating = '0';
      if (ratings.length > 0) {
        avgRating = (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(
          2,
        );
      }

      const result = await this.eventDB.findOneAndUpdate(
        { _id: eventId },
        { $set: { avgRating }, $pull: { feedbackDetails: { _id: reviewId } } },
      );

      return {
        message: 'Event review removed successfully',
        success: true,
        result,
      };
    } catch (error) {
      throw error;
    }
  }
}
