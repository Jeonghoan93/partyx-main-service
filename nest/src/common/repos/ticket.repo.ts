import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from 'src/common/schemas/ticket.schema';

@Injectable()
export class TicketRepository {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
  ) {}

  async find(query: any) {
    const ticket = await this.ticketModel.find(query);
    return ticket;
  }

  async findOne(query: any) {
    const ticket = await this.ticketModel.findOne(query);
    return ticket;
  }

  async create(ticket: any) {
    const createdTicket = await this.ticketModel.create(ticket);
    return createdTicket;
  }

  async findOneAndUpdate(query: any, update: any, options: any) {
    const ticket = await this.ticketModel.findOneAndUpdate(
      query,
      update,
      options,
    );
    return ticket;
  }
}
