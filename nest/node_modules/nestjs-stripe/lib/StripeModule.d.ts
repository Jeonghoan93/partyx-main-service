import { DynamicModule } from '@nestjs/common';
import { StripeAsyncOptions, StripeOptions } from './interfaces';
export declare class StripeModule {
    static forRoot(options: StripeOptions): DynamicModule;
    static forRootAsync(options: StripeAsyncOptions): DynamicModule;
}
