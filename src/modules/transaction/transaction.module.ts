import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { EAppConfig, ERepository } from 'src/utils/enum/config.enum';
import { DataSource } from 'typeorm';
import { Transaction } from './transaction.entity';
import { TransactionController } from './transaction.controller';
import { BankAccountModule } from '../bankAccount/bankAccount.module';

@Module({
  imports: [BankAccountModule],
  providers: [
    TransactionService,
    {
      provide: ERepository.TRANSACTION,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Transaction),
      inject: [EAppConfig.DATA_SOURCE],
    },
  ],
  exports: [TransactionService, ERepository.TRANSACTION],
  controllers: [TransactionController],
})
export class TransactionModule {}
