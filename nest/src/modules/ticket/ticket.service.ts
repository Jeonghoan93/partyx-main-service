import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectStripe } from 'nestjs-stripe';
import { EventRepository } from 'src/common/repos/event.repo';
import { TicketRepository } from 'src/common/repos/ticket.repo';
import { UserRepository } from 'src/common/repos/user.repo';
import { paymentStatus, ticketStatus } from 'src/common/schemas/ticket.schema';
import { userTypes } from 'src/common/types';
import { sendEmail } from 'src/common/utils/mail-handler';
import Stripe from 'stripe';
import { checkoutDtoArr } from './dto/checkout.dto';

const config = new ConfigService();

@Injectable()
export class TicketService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @Inject(TicketRepository) private readonly ticketDB: TicketRepository,
    @Inject(EventRepository) private readonly eventDB: EventRepository,
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) {}

  async create(createTicketDto: Record<string, any>) {
    try {
      const ticketExists = await this.ticketDB.findOne({
        checkoutSessionId: createTicketDto.checkoutSessionId,
      });
      if (ticketExists) return ticketExists;
      const result = await this.ticketDB.create(createTicketDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll(status: string, user: Record<string, any>) {
    try {
      const userDetails = await this.userDB.findOneById(user._id.toString());
      const query = {} as Record<string, any>;
      if (userDetails.type === userTypes.CUSTOMER) {
        query.userId = user._id.toString();
      }
      if (status) {
        query.status = status;
      }
      const tickets = await this.ticketDB.find(query);
      return {
        success: true,
        result: tickets,
        message: 'Ticket fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.ticketDB.findOne({ _id: id });
      return {
        success: true,
        result,
        message: 'Ticket fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async checkout(body: checkoutDtoArr, user: Record<string, any>) {
    try {
      const lineItems = [];
      const cartItems = body.checkoutDetails;
      for (const item of cartItems) {
        const itemsAreInStock = await this.eventDB.findLicense({
          eventSku: item.skuId,
          isSold: false,
        });
        if (itemsAreInStock.length <= item.quantity) {
          lineItems.push({
            price: item.skuPriceId,
            quantity: item.quantity,
            adjustable_quantity: {
              enabled: true,
              maximum: 5,
              minimum: 1,
            },
          });
        }
      }

      if (lineItems.length === 0) {
        throw new BadRequestException(
          'These events are not available right now',
        );
      }

      const session = await this.stripeClient.checkout.sessions.create({
        line_items: lineItems,
        metadata: {
          userId: user._id.toString(),
        },
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
          enabled: true,
        },
        customer_email: user.email,
        success_url: config.get('stripe.successUrl'),
        cancel_url: config.get('stripe.cancelUrl'),
      });

      return {
        message: 'Payment checkout session successfully created',
        success: true,
        result: session.url,
      };
    } catch (error) {
      throw error;
    }
  }

  async webhook(rawBody: Buffer, sig: string) {
    try {
      let event;
      try {
        event = this.stripeClient.webhooks.constructEvent(
          rawBody,
          sig,
          config.get('stripe.webhookSecret'),
        );
      } catch (err) {
        throw new BadRequestException('Webhook Error:', err.message);
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const ticketData = await this.createTicketObject(session);
        const ticket = await this.create(ticketData);
        if (session.payment_status === paymentStatus.paid) {
          if (ticket.ticketStatus !== ticketStatus.completed) {
            for (const item of ticket.ticketedItems) {
              const licenses = await this.getLicense(ticketData.ticketId, item);
              item.licenses = licenses;
            }
          }
          await this.fullFillTicket(session.id, {
            ticketStatus: ticketStatus.completed,
            isTicketDelivered: true,
            ...ticketData,
          });
          this.sendTicketEmail(
            ticketData.customerEmail,
            ticketData.ticketId,
            `${config.get('emailService.emailTemplates.ticketSuccess')}${
              ticket._id
            }`,
          );
        }
      } else {
        console.log('Unhandled event type', event.type);
      }
    } catch (error) {
      throw error;
    }
  }

  async fullFillTicket(
    checkoutSessionId: string,
    updateTicketDto: Record<string, any>,
  ) {
    try {
      return await this.ticketDB.findOneAndUpdate(
        { checkoutSessionId },
        updateTicketDto,
        { new: true },
      );
    } catch (error) {
      throw error;
    }
  }

  async sendTicketEmail(email: string, ticketId: string, ticketLink: string) {
    await sendEmail(
      email,
      config.get('emailService.emailTemplates.ticketSuccess'),
      'Ticket Success - PartyX',
      {
        ticketId,
        ticketLink,
      },
    );
  }
  async getLicense(ticketId: string, item: Record<string, any>) {
    try {
      const event = await this.eventDB.findOne({
        _id: item.eventId,
      });

      const skuDetails = event.skuDetails.find(
        (sku) => sku.skuCode === item.skuCode,
      );

      const licenses = await this.eventDB.findLicense(
        {
          eventSku: skuDetails._id,
          isSold: false,
        },
        item.quantity,
      );

      const licenseIds = licenses.map((license) => license._id);

      await this.eventDB.updateLicenseMany(
        {
          _id: {
            $in: licenseIds,
          },
        },
        {
          isSold: true,
          ticketId,
        },
      );

      return licenses.map((license) => license.licenseKey);
    } catch (error) {
      throw error;
    }
  }

  async createTicketObject(session: Stripe.Checkout.Session) {
    try {
      const lineItems = await this.stripeClient.checkout.sessions.listLineItems(
        session.id,
      );
      const ticketData = {
        ticketId: Math.floor(new Date().valueOf() * Math.random()) + '',
        userId: session.metadata?.userId?.toString(),
        customerAddress: session.customer_details?.address,
        customerEmail: session.customer_email,
        customerPhoneNumber: session.customer_details?.phone,
        paymentInfo: {
          paymentMethod: session.payment_method_types[0],
          paymentIntentId: session.payment_intent,
          paymentDate: new Date(),
          paymentAmount: session.amount_total / 100,
          paymentStatus: session.payment_status,
        },
        ticketDate: new Date(),
        checkoutSessionId: session.id,
        ticketedItems: lineItems.data.map((item) => {
          item.price.metadata.quantity = item.quantity + '';
          return item.price.metadata;
        }),
      };
      return ticketData;
    } catch (error) {
      throw error;
    }
  }
}
