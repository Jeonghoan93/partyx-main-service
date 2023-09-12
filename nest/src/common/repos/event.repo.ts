import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParsedOptions } from 'qs-to-mongo/lib/query/options-to-mongo';
import { Event } from 'src/common/schemas/event.schema';
import { License } from 'src/common/schemas/license.schema';
import { CreateEventDto } from 'src/modules/event/dto/create-event.dto';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(License.name) private readonly licenseModel: Model<License>,
  ) {}

  async create(event: CreateEventDto) {
    const createdEvent = await this.eventModel.create(event);
    return createdEvent;
  }

  async findOne(query: any) {
    const event = await this.eventModel.findOne(query);
    return event;
  }

  async findOneAndUpdate(query: any, update: any) {
    const event = await this.eventModel.findOneAndUpdate(query, update, {
      new: true,
    });
    return event;
  }

  async findOneAndDelete(query: any) {
    const event = await this.eventModel.findOneAndDelete(query);
    return event;
  }

  async findEventWithGroupBy() {
    const events = await this.eventModel.aggregate([
      {
        $facet: {
          latestEvents: [{ $sort: { createdAt: -1 } }, { $limit: 4 }],
          topRatedEvents: [{ $sort: { avgRating: -1 } }, { $limit: 8 }],
        },
      },
    ]);
    return events;
  }

  async find(query: Record<string, any>, options: ParsedOptions) {
    options.sort = options.sort || { _id: 1 };
    options.limit = options.limit || 12;
    options.skip = options.skip || 0;

    if (query.search) {
      query.eventName = new RegExp(query.search, 'i');
      delete query.search;
    }

    const events = await this.eventModel.aggregate([
      {
        $match: query,
      },
      {
        $sort: options.sort,
      },
      { $skip: options.skip },
      { $limit: options.limit },
    ]);

    const totalEventCount = await this.eventModel.countDocuments(query);
    return { totalEventCount, events };
  }

  async findRelatedEvents(query: Record<string, any>) {
    const events = await this.eventModel.aggregate([
      {
        $match: query,
      },
      {
        $sample: { size: 4 },
      },
    ]);
    return events;
  }

  async createLicense(event: string, eventSku: string, licenseKey: string) {
    const license = await this.licenseModel.create({
      event,
      eventSku,
      licenseKey,
    });
    return license;
  }

  async removeLicense(query: any) {
    const license = await this.licenseModel.findOneAndDelete(query);
    return license;
  }

  async findLicense(query: any, limit?: number) {
    if (limit && limit > 0) {
      const license = await this.licenseModel.find(query).limit(limit);
      return license;
    }
    const license = await this.licenseModel.find(query);
    return license;
  }

  async updateLicense(query: any, update: any) {
    const license = await this.licenseModel.findOneAndUpdate(query, update, {
      new: true,
    });
    return license;
  }

  async updateLicenseMany(query: any, data: any) {
    const license = await this.licenseModel.updateMany(query, data);
    return license;
  }

  async deleteSku(id: string, skuId: string) {
    return await this.eventModel.updateOne(
      { _id: id },
      {
        $pull: {
          skuDetails: { _id: skuId },
        },
      },
    );
  }

  async deleteAllLicences(eventId: string, skuId: string) {
    if (eventId) return await this.licenseModel.deleteMany({ event: eventId });
    return await this.licenseModel.deleteMany({ eventSku: skuId });
  }
}
