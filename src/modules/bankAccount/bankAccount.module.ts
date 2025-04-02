import { Module } from '@nestjs/common';
import { BankAccountService } from './bankAccount.service';
import { EAppConfig, ERepository } from 'src/utils/enum/config.enum';
import { DataSource } from 'typeorm';
import { BankAccount } from './bankAccount.entity';
import { BankAccountController } from './bankAccount.controller';

@Module({
  imports: [],
  providers: [
    BankAccountService,
    {
      provide: ERepository.BANK_ACCOUNT,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(BankAccount),
      inject: [EAppConfig.DATA_SOURCE],
    },
  ],
  exports: [BankAccountService, ERepository.BANK_ACCOUNT],
  controllers: [BankAccountController],
})
export class BankAccountModule {}
