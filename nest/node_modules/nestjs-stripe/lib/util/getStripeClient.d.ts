import Stripe from 'stripe';
import { StripeOptions } from './../interfaces';
export declare function getStripeClient({ apiKey, appInfo, ...options }: StripeOptions): Stripe;
