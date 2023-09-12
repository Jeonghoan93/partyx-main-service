import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/common/middleware/role.decorators';
import { userTypes } from 'src/common/types';
import { CreateEventDto } from './dto/create-event.dto';
import { EventSkuDto, EventSkuDtoArr } from './dto/event-sku.dto';
import { GetEventQueryDto } from './dto/get-event-query-dto';
import { EventService } from './event.service';

@Controller('api/event')
export class EventController {
  constructor(private readonly service: EventService) {}

  @Post()
  @HttpCode(201)
  @Roles(userTypes.ADMIN)
  async create(@Body() dto: CreateEventDto) {
    return await this.service.createEvent(dto);
  }

  @Get()
  findAll(@Query() query: GetEventQueryDto) {
    return this.service.findAllEvents(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOneEvent(id);
  }

  @Patch(':id')
  @Roles(userTypes.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: CreateEventDto,
  ) {
    return await this.service.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.removeEvent(id);
  }

  @Post('/:eventId/skus')
  @Roles(userTypes.ADMIN)
  async updateEventSku(
    @Param('eventId') eventId: string,
    @Body() updateEventSkuDto: EventSkuDtoArr,
  ) {
    return await this.service.updateEventSku(eventId, updateEventSkuDto);
  }

  @Put('/:eventId/skus/:skuId')
  @Roles(userTypes.ADMIN)
  async updateEventSkuById(
    @Param('eventId') eventId: string,
    @Param('skuId') skuId: string,
    @Body() updateEventSkuDto: EventSkuDto,
  ) {
    return await this.service.updateEventSkuById(
      eventId,
      skuId,
      updateEventSkuDto,
    );
  }

  @Delete('/:eventId/skus/:skuId')
  @Roles(userTypes.ADMIN)
  async deleteSkuById(
    @Param('eventId') eventId: string,
    @Param('skuId') skuId: string,
  ) {
    return await this.service.deleteEventSkuById(eventId, skuId);
  }

  @Post('/:eventId/skus/:skuId/licenses')
  @Roles(userTypes.ADMIN)
  async addEventSkuLicense(
    @Param('eventId') eventId: string,
    @Param('skuId') skuId: string,
    @Body('licenseKey') licenseKey: string,
  ) {
    return await this.service.addEventSkuLicense(eventId, skuId, licenseKey);
  }

  @Delete('/licenses/:licenseKeyId')
  @Roles(userTypes.ADMIN)
  async removeEventSkuLicense(@Param('licenseKeyId') licenseId: string) {
    return await this.service.removeEventSkuLicense(licenseId);
  }

  @Get('/:eventId/skus/:skuId/licenses')
  @Roles(userTypes.ADMIN)
  async getEventSkuLicenses(
    @Param('eventId') eventId: string,
    @Param('skuId') skuId: string,
  ) {
    return await this.service.getEventSkuLicenses(eventId, skuId);
  }

  @Put('/:eventId/skus/:skuId/licenses/:licenseKeyId')
  @Roles(userTypes.ADMIN)
  async updateEventSkuLicense(
    @Param('eventId') eventId: string,
    @Param('skuId') skuId: string,
    @Param('licenseKeyId') licenseKeyId: string,
    @Body('licenseKey') licenseKey: string,
  ) {
    return await this.service.updateEventSkuLicense(
      eventId,
      skuId,
      licenseKeyId,
      licenseKey,
    );
  }
}
