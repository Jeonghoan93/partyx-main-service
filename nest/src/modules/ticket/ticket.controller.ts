import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { checkoutDtoArr } from './dto/checkout.dto';
import { TicketService } from './ticket.service';

@Controller('api/ticket')
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Get()
  async findAll(@Query('status') status: string, @Req() req: any) {
    return await this.service.findAll(status, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post('/checkout')
  async checkout(@Body() body: checkoutDtoArr, @Req() req: any) {
    return await this.service.checkout(body, req.user);
  }

  @Post('/webhook')
  async webhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') sig: string,
  ) {
    return await this.service.webhook(rawBody, sig);
  }
}
