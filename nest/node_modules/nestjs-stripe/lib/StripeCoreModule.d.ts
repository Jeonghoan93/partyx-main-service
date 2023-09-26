import { DynamicModule } from '@nestjs/common';
import { StripeAsyncOptions, StripeOptions } from './interfaces';
export declare class StripeCoreModule {
    static forRoot(options: StripeOptions): DynamicModule;
    static forRootAsync(options: StripeAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
