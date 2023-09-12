import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

export interface UpdateStripeProductDto {
  name?: string;
  description?: string;
  images?: string[];
}

@Injectable()
export class StripeService {
  constructor(@InjectStripe() private readonly stripeClient: Stripe) {}

  async createStripeProductId(
    name: string,
    description: string,
  ): Promise<string> {
    const createdProduct = await this.stripeClient.products.create({
      name: name,
      description: description,
    });
    return createdProduct.id;
  }

  async createStripePriceId(
    amount: number,
    currency: string,
    productId: string,
    metadata: Record<string, any>,
  ): Promise<string> {
    const createdPrice = await this.stripeClient.prices.create({
      unit_amount: amount * 100,
      currency: currency,
      product: productId,
      metadata: metadata,
    });
    return createdPrice.id;
  }

  async updateStripeProductById(id: string, dto: UpdateStripeProductDto) {
    await this.stripeClient.products.update(id, dto);
  }

  async updateStripePriceById(id: string, dto: any) {
    await this.stripeClient.prices.update(id, dto);
  }

  async deleteStripeProductById(id: string) {
    await this.stripeClient.products.del(id);
  }

  async addImageToStripeProduct(productId: string, imageUrl: string) {
    await this.stripeClient.products.update(productId, {
      images: [imageUrl],
    });
  }

  async deactivateStripePrice(priceId: string) {
    await this.stripeClient.prices.update(priceId, {
      active: false,
    });
  }
}
