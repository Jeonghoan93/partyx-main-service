import { Injectable } from '@nestjs/common';
import qs2m from 'qs-to-mongo';
import { EventRepository } from 'src/common/repos/event.repo';
import { Event } from 'src/common/schemas/event.schema';
import { ResponseDto } from 'src/common/types';
import { StripeService } from '../payment/stripe.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventSkuDto, EventSkuDtoArr } from './dto/event-sku.dto';
import { GetEventQueryDto } from './dto/get-event-query-dto';

@Injectable()
export class EventService {
  constructor(
    private readonly eventDB: EventRepository,
    private readonly stripeService: StripeService,
  ) {}
  async createEvent(
    createEventDto: CreateEventDto,
  ): Promise<ResponseDto<Event>> {
    try {
      if (!createEventDto.stripeEventId) {
        createEventDto.stripeEventId =
          await this.stripeService.createStripeProductId(
            createEventDto.eventName,
            createEventDto.description,
          );
      }

      const createdEventInDB = await this.eventDB.create(createEventDto);
      return new ResponseDto(
        'Event created successfully',
        {
          data: createdEventInDB,
        },
        true,
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllEvents(query: GetEventQueryDto): Promise<ResponseDto<Event[]>> {
    try {
      let callForHomePage = false;
      if (query.homepage) {
        callForHomePage = true;
      }
      delete query.homepage;
      const { criteria, options, links } = qs2m(query);
      if (callForHomePage) {
        const events = await this.eventDB.findEventWithGroupBy();
        return new ResponseDto(
          events.length > 0 ? 'Event fetched successfully' : 'No events found',
          {
            data: events,
          },
          true,
        );
      }
      const { totalEventCount, events } = await this.eventDB.find(
        criteria,
        options,
      );
      return new ResponseDto(
        totalEventCount > 0 ? 'Event fetched successfully' : 'No events found',
        {
          data: events,
          metadata: {
            skip: options.skip || 0,
            limit: options.limit || 10,
            total: totalEventCount,
            pages: options.limit
              ? Math.ceil(totalEventCount / options.limit)
              : 1,
            links: links('/', totalEventCount),
          },
        },
        true,
      );
    } catch (error) {
      throw error;
    }
  }

  async findOneEvent(id: string): Promise<{
    message: string;
    result: { event: Event; relatedEvent: Event[] };
    success: boolean;
  }> {
    try {
      const event: Event = await this.eventDB.findOne({ _id: id });
      if (!event) {
        throw new Error('Event does not exist');
      }
      const relatedEvent: Event[] = await this.eventDB.findRelatedEvents({
        type: event.type,
        _id: { $ne: id },
      });

      return {
        message: 'Event fetched successfully',
        result: { event, relatedEvent },
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(
    id: string,
    updateEventDto: CreateEventDto,
  ): Promise<ResponseDto<Event>> {
    try {
      const eventExist = await this.eventDB.findOne({ _id: id });
      if (!eventExist) {
        throw new Error('Event does not exist');
      }
      const updatedEvent = await this.eventDB.findOneAndUpdate(
        { _id: id },
        updateEventDto,
      );
      if (!updateEventDto.stripeEventId)
        await this.stripeService.updateStripeProductById(
          eventExist.stripeEventId,
          {
            name: updateEventDto.eventName,
            description: updateEventDto.description,
          },
        );
      return new ResponseDto(
        'Event updated successfully',
        {
          data: updatedEvent,
        },
        true,
      );
    } catch (error) {
      throw error;
    }
  }

  async removeEvent(id: string): Promise<{
    message: string;
    success: boolean;
    result: null;
  }> {
    try {
      const eventExist = await this.eventDB.findOne({ _id: id });
      if (!eventExist) {
        throw new Error('Event does not exist');
      }
      await this.eventDB.findOneAndDelete({ _id: id });
      await this.stripeService.deleteStripeProductById(
        eventExist.stripeEventId,
      );
      return {
        message: 'Event deleted successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw error;
    }
  }

  // this is for create one or multiple sku for an event
  async updateEventSku(eventId: string, data: EventSkuDtoArr) {
    try {
      const event = await this.eventDB.findOne({ _id: eventId });
      if (!event) {
        throw new Error('Event does not exist');
      }

      const skuCode = Math.random().toString(36).substring(2, 5) + Date.now();
      for (let i = 0; i < data.skuDetails.length; i++) {
        if (!data.skuDetails[i].stripePriceId) {
          data.skuDetails[i].stripePriceId =
            await this.stripeService.createStripePriceId(
              data.skuDetails[i].price * 100,
              'sek',
              event.stripeEventId,
              {
                skuCode: skuCode,
                lifetime: data.skuDetails[i].lifetime + '',
                eventId: eventId,
                price: data.skuDetails[i].price,
                eventName: event.eventName,
                eventImage: event.image,
              },
            );
        }
        data.skuDetails[i].skuCode = skuCode;
      }

      await this.eventDB.findOneAndUpdate(
        { _id: eventId },
        { $push: { skuDetails: data.skuDetails } },
      );

      return {
        message: 'Event sku updated successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateEventSkuById(eventId: string, skuId: string, data: EventSkuDto) {
    try {
      const event = await this.eventDB.findOne({ _id: eventId });
      if (!event) {
        throw new Error('Event does not exist');
      }

      const sku = event.skuDetails.find((sku) => sku._id == skuId);
      if (!sku) {
        throw new Error('Sku does not exist');
      }

      if (data.price !== sku.price) {
        data.stripePriceId = await this.stripeService.createStripePriceId(
          data.price,
          'sek',
          event.stripeEventId,
          {
            skuCode: sku.skuCode,
            lifetime: data.lifetime + '',
            eventId: eventId,
            price: data.price,
            eventName: event.eventName,
            eventImage: event.image,
          },
        );
      }

      const dataForUpdate = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          dataForUpdate[`skuDetails.$.${key}`] = data[key];
        }
      }

      const result = await this.eventDB.findOneAndUpdate(
        { _id: eventId, 'skuDetails._id': skuId },
        { $set: dataForUpdate },
      );

      return {
        message: 'Event sku updated successfully',
        success: true,
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteEventSkuById(id: string, skuId: string) {
    try {
      const eventDetails = await this.eventDB.findOne({ _id: id });
      const skuDetails = eventDetails.skuDetails.find(
        (sku) => sku._id.toString() === skuId,
      );
      await this.stripeService.updateStripePriceById(skuDetails.stripePriceId, {
        active: false,
      });

      // delete the sku details from event
      await this.eventDB.deleteSku(id, skuId);
      // delete all the licences from db for that sku
      await this.eventDB.deleteAllLicences(undefined, skuId);

      return {
        message: 'Event sku details deleted successfully',
        success: true,
        result: {
          id,
          skuId,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async addEventSkuLicense(eventId: string, skuId: string, licenseKey: string) {
    try {
      const event = await this.eventDB.findOne({ _id: eventId });
      if (!event) {
        throw new Error('Event does not exist');
      }

      const sku = event.skuDetails.find((sku) => sku._id == skuId);
      if (!sku) {
        throw new Error('Sku does not exist');
      }

      const result = await this.eventDB.createLicense(
        eventId,
        skuId,
        licenseKey,
      );

      return {
        message: 'License key added successfully',
        success: true,
        result: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeEventSkuLicense(id: string) {
    try {
      const result = await this.eventDB.removeLicense({ _id: id });

      return {
        message: 'License key removed successfully',
        success: true,
        result: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async getEventSkuLicenses(eventId: string, skuId: string) {
    try {
      const event = await this.eventDB.findOne({ _id: eventId });
      if (!event) {
        throw new Error('Event does not exist');
      }

      const sku = event.skuDetails.find((sku) => sku._id == skuId);
      if (!sku) {
        throw new Error('Sku does not exist');
      }

      const result = await this.eventDB.findLicense({
        event: eventId,
        eventSku: skuId,
      });

      return {
        message: 'Licenses fetched successfully',
        success: true,
        result: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateEventSkuLicense(
    eventId: string,
    skuId: string,
    licenseKeyId: string,
    licenseKey: string,
  ) {
    try {
      const event = await this.eventDB.findOne({ _id: eventId });
      if (!event) {
        throw new Error('Event does not exist');
      }

      const sku = event.skuDetails.find((sku) => sku._id == skuId);
      if (!sku) {
        throw new Error('Sku does not exist');
      }

      const result = await this.eventDB.updateLicense(
        { _id: licenseKeyId },
        { licenseKey: licenseKey },
      );

      return {
        message: 'License key updated successfully',
        success: true,
        result: result,
      };
    } catch (error) {
      throw error;
    }
  }
}
