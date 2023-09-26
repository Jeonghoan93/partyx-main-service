import { Provider } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeOptions } from './../interfaces';
export declare function createStripeProvider(options: StripeOptions): Provider<Stripe>;
