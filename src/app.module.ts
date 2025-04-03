import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.provider';
import { ConfigModule } from '@nestjs/config';
import * as configuration from './config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/HttpException';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { BankAccountModule } from './modules/bankAccount/bankAccount.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration.default],
      isGlobal: true,
    }),
    DatabaseModule,
    BankAccountModule,
    TransactionModule,
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      inject: [],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
