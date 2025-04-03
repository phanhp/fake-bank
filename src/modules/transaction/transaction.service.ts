import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { ERepository } from 'src/utils/enum/config.enum';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './transaction.dto';
import { plainToClass } from 'class-transformer';
import { BankAccount } from '../bankAccount/bankAccount.entity';
import { Otp } from '../otp/otp.entity';
import { BankAccountService } from '../bankAccount/bankAccount.service';
import { ETransactionStatus, ETransactionType } from 'src/utils/enum/app.enum';
import { BaseBankAccountDto } from '../bankAccount/bankAccount.dto';

function currencyExchange(amount: number, currency?: string): number {
  const baseCurrencyRate = {
    VND: 25570,
    USD: 1,
    GBP: 1.2916,
    JPY: 149.96,
    CHF: 0.88,
  };

  const rate = baseCurrencyRate[currency as keyof typeof baseCurrencyRate] || 1;

  return amount * rate;
}

@Injectable()
export class TransactionService extends TypeOrmCrudService<Transaction> {
  constructor(
    @Inject(ERepository.TRANSACTION)
    repo: Repository<Transaction>,
    private bankAccountService: BankAccountService,
  ) {
    super(repo);
  }

  //----- CREATE
  async create({
    input,
    beneficiaryBankAccount,
    remitterBankAccount,
    otp,
  }: {
    input?: Omit<CreateTransactionDto, 'id'>;
    beneficiaryBankAccount?: BankAccount;
    remitterBankAccount?: BankAccount;
    otp?: Otp;
  }): Promise<Transaction> {
    return this.repo.save(
      plainToClass(Transaction, {
        ...input,
        beneficiaryBankAccount,
        remitterBankAccount,
        otp,
      }),
    );
  }

  async createWithdrawTransaction({
    amount,
    bankNumber,
  }: {
    amount: number;
    bankNumber: string;
  }): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException({
        message: 'Invalid amount input',
        code: 'INVALID AMOUNT',
        status: 400,
      });
    }

    const remitterBankAccount: BankAccount =
      await this.bankAccountService.findByBankNumber({ bankNumber });
    if (!remitterBankAccount) {
      throw new BadRequestException({
        message: 'Bank account can not be found',
        code: 'BANK_ACCOUNT NOT FOUND',
        status: 404,
      });
    }
    if (remitterBankAccount.balance < amount) {
      throw new HttpException(
        {
          message: 'Not enough balance in sender account',
          code: 'INSUFFICIENT_FUNDS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const neoTransactionInfor = new CreateTransactionDto();
    neoTransactionInfor.amount = amount;
    neoTransactionInfor.type = ETransactionType.WITHDRAW;
    neoTransactionInfor.status = ETransactionStatus.SUCCESS;
    neoTransactionInfor.description = `Mr/Mrs ${remitterBankAccount.userName} 
        has withdrew ${currencyExchange(amount, remitterBankAccount.currency)}${remitterBankAccount.currency}`;

    try {
      await this.bankAccountService.update({
        bankAccount: remitterBankAccount,
        input: plainToClass(BaseBankAccountDto, {
          balance: remitterBankAccount.balance - amount,
        }),
      });

      return this.create({
        input: neoTransactionInfor,
        remitterBankAccount,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createDepositTransaction({
    amount,
    bankNumber,
  }: {
    amount: number;
    bankNumber: string;
  }): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException({
        message: 'Invalid amount input',
        code: 'INVALID AMOUNT',
        status: 400,
      });
    }

    const beneficiaryBankAccount: BankAccount =
      await this.bankAccountService.findByBankNumber({ bankNumber });
    if (!beneficiaryBankAccount) {
      throw new BadRequestException({
        message: 'Bank account can not be found',
        code: 'BANK_ACCOUNT NOT FOUND',
        status: 404,
      });
    }
    const neoTransactionInfor = new CreateTransactionDto();
    neoTransactionInfor.amount = amount;
    neoTransactionInfor.type = ETransactionType.DEPOSIT;
    neoTransactionInfor.status = ETransactionStatus.SUCCESS;
    neoTransactionInfor.description = `Mr/Mrs ${beneficiaryBankAccount.userName} 
        has deposit ${currencyExchange(amount, beneficiaryBankAccount.currency)}${beneficiaryBankAccount.currency}`;

    try {
      await this.bankAccountService.update({
        bankAccount: beneficiaryBankAccount,
        input: plainToClass(BaseBankAccountDto, {
          balance: beneficiaryBankAccount.balance + amount,
        }),
      });

      return this.create({
        input: neoTransactionInfor,
        beneficiaryBankAccount,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createTransferTransaction({
    amount,
    remitterBankNumber,
    beneficiaryBankNumber,
  }: {
    amount: number;
    remitterBankNumber: string;
    beneficiaryBankNumber: string;
  }): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException({
        message: 'Invalid amount input',
        code: 'INVALID AMOUNT',
        status: 400,
      });
    }

    if (remitterBankNumber === beneficiaryBankNumber) {
      throw new BadRequestException({
        message: 'Invalid transaction',
        code: 'INVALID TRANSACTION',
        status: 400,
      });
    }

    const remitterBankAccount: BankAccount =
      await this.bankAccountService.findByBankNumber({
        bankNumber: remitterBankNumber,
      });
    if (!remitterBankAccount) {
      throw new BadRequestException({
        message: 'Bank account can not be found',
        code: 'BANK_ACCOUNT NOT FOUND',
        status: 404,
      });
    }
    if (remitterBankAccount.balance < amount) {
      throw new HttpException(
        {
          message: 'Not enough balance in sender account',
          code: 'INSUFFICIENT_FUNDS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const beneficiaryBankAccount: BankAccount =
      await this.bankAccountService.findByBankNumber({
        bankNumber: beneficiaryBankNumber,
      });
    if (!beneficiaryBankAccount) {
      throw new BadRequestException({
        message: 'Bank account can not be found',
        code: 'BANK_ACCOUNT NOT FOUND',
        status: 404,
      });
    }

    const neoTransactionInfor = new CreateTransactionDto();
    neoTransactionInfor.amount = amount;
    neoTransactionInfor.type = ETransactionType.TRANSFER;
    neoTransactionInfor.status = ETransactionStatus.SUCCESS;

    try {
      await this.bankAccountService.update({
        bankAccount: remitterBankAccount,
        input: plainToClass(BaseBankAccountDto, {
          balance: remitterBankAccount.balance - amount,
        }),
      });
      await this.bankAccountService.update({
        bankAccount: beneficiaryBankAccount,
        input: plainToClass(BaseBankAccountDto, {
          balance: beneficiaryBankAccount.balance + amount,
        }),
      });

      return this.create({
        input: neoTransactionInfor,
        remitterBankAccount,
        beneficiaryBankAccount,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //----- READ
  // Find
  async findAll(): Promise<Transaction[]> {
    return this.repo.find();
  }

  async findById({ id }: { id: number }): Promise<Transaction> {
    return this.repo.findOneBy({ id });
  }
}
