import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { BankAccount } from './bankAccount.entity';
import { ERepository, ESearchParam } from 'src/utils/enum/config.enum';
import { Repository } from 'typeorm';
import {
  BaseBankAccountDto,
  CreateBankAccountDto,
  SearchBankAccountDto,
} from './bankAccount.dto';
import { plainToClass } from 'class-transformer';
import { CrudOptions, CrudRequest } from '@dataui/crud';
import AppUtils from 'src/utils/app.util';
import { faker } from '@faker-js/faker';

@Injectable()
export class BankAccountService extends TypeOrmCrudService<BankAccount> {
  constructor(
    @Inject(ERepository.BANK_ACCOUNT)
    repo: Repository<BankAccount>,
  ) {
    super(repo);
  }

  //----- CREATE
  async create({
    input,
  }: {
    input?: Omit<CreateBankAccountDto, 'id'>;
  }): Promise<BankAccount> {
    return this.repo.save(plainToClass(BankAccount, { ...input }));
  }

  //----- READ
  // Find
  async findAll(): Promise<BankAccount[]> {
    return this.repo.find();
  }

  async findById({ id }: { id: number }): Promise<BankAccount> {
    return this.repo.findOneBy({ id });
  }

  async findByBankNumber({
    bankNumber,
  }: {
    bankNumber: string;
  }): Promise<BankAccount> {
    return this.repo.findOneBy({ bankNumber });
  }

  // Search
  // CrudRequest builder
  generateSearchPropertyRequest({
    search,
    selectedFields,
    transactionSelectedFields,
    otpSelectedFields,
  }: {
    search?: SearchBankAccountDto;
    selectedFields?: string[];
    transactionSelectedFields?: string[];
    otpSelectedFields?: string[];
  }): {
    crudOptions: CrudOptions;
    crudRequest: CrudRequest;
  } {
    const crudOptions: CrudOptions =
      AppUtils.generateBaseCrudOptions<BankAccount>();
    const crudRequest: CrudRequest =
      AppUtils.generateBaseCrudRequest<BankAccount>({
        crudOptions,
        page: search.page,
        count: search.count,
        sortOptions: search.sortOptions
          ? search.sortOptions
          : [{ field: 'id', order: 'ASC' }],
      });

    selectedFields = selectedFields
      ? selectedFields
      : [
          'userName',
          'bankNumber',
          'balance',
          'currency',
          'createdAt',
          'updatedAt',
        ];
    crudRequest.parsed.fields.push(...selectedFields);

    transactionSelectedFields = transactionSelectedFields
      ? transactionSelectedFields
      : ['status', 'amount', 'type', 'createdAt', 'updatedAt'];

    otpSelectedFields = otpSelectedFields
      ? otpSelectedFields
      : ['code', 'createdAt', 'updatedAt'];

    //-------------------- SEARCH WITH BANK_ACCOUNT CONDITION --------------------
    if (search.id) {
      const { id } = search;
      if (Array.isArray(id)) {
        crudRequest.parsed.search.$and.push({ id: { [ESearchParam.IN]: id } });
      } else {
        crudRequest.parsed.search.$and.push({
          id: { [ESearchParam.EQUAL]: id },
        });
      }
    }
    if (search.bankNumber) {
      const { bankNumber } = search;
      if (Array.isArray(bankNumber)) {
        crudRequest.parsed.search.$and.push({
          bankNumber: { [ESearchParam.IN]: bankNumber },
        });
      } else {
        crudRequest.parsed.search.$and.push({
          bankNumber: { [ESearchParam.EQUAL]: bankNumber },
        });
      }
    }
    if (search.currency) {
      const { currency } = search;
      crudRequest.parsed.search.$and.push({
        currency: { [ESearchParam.EQUAL]: currency },
      });
    }

    //-------------------- SEARCH WITH TRANSACTION CONDITION --------------------
    if (search.depositTransactionIds) {
      const { depositTransactionIds } = search;
      AppUtils.autoGenerateJoinsRelationShip({
        crudRequest,
        crudOptions,
        joinPath: 'depositTransactions',
        selectedFields: { ['depositTransactions']: transactionSelectedFields },
      });

      if (Array.isArray(depositTransactionIds)) {
        crudRequest.parsed.search.$and.push({
          [`depositTransactions.id`]: {
            [ESearchParam.IN]: depositTransactionIds,
          },
        });
      } else {
        crudRequest.parsed.search.$and.push({
          [`depositTransactions.id`]: {
            [ESearchParam.EQUAL]: depositTransactionIds,
          },
        });
      }
    }
    if (search.withdrawTransactionIds) {
      const { withdrawTransactionIds } = search;
      AppUtils.autoGenerateJoinsRelationShip({
        crudRequest,
        crudOptions,
        joinPath: 'withdrawTransactions',
        selectedFields: { ['withdrawTransactions']: transactionSelectedFields },
      });

      if (Array.isArray(withdrawTransactionIds)) {
        crudRequest.parsed.search.$and.push({
          [`withdrawTransactions.id`]: {
            [ESearchParam.IN]: withdrawTransactionIds,
          },
        });
      } else {
        crudRequest.parsed.search.$and.push({
          [`withdrawTransactions.id`]: {
            [ESearchParam.EQUAL]: withdrawTransactionIds,
          },
        });
      }
    }

    //-------------------- SEARCH WITH OTP CONDITION --------------------
    if (search.depositTransactionOtpIds) {
      const { depositTransactionOtpIds } = search;
      AppUtils.autoGenerateJoinsRelationShip({
        crudRequest,
        crudOptions,
        joinPath: 'depositTransactions.otp',
        selectedFields: {
          ['depositTransactionsOtp']: otpSelectedFields,
        },
      });
      if (Array.isArray(depositTransactionOtpIds)) {
        crudRequest.parsed.search.$and.push({
          [`depositTransactionsOtp.id`]: {
            [ESearchParam.IN]: depositTransactionOtpIds,
          },
        });
      } else {
        crudRequest.parsed.search.$and.push({
          [`depositTransactionsOtp.id`]: {
            [ESearchParam.EQUAL]: depositTransactionOtpIds,
          },
        });
      }
    }

    return {
      crudOptions: crudOptions,
      crudRequest: crudRequest,
    };
  }

  //----- UPDATE
  async update({
    bankAccount,
    input,
  }: {
    bankAccount: BankAccount;
    input?: BaseBankAccountDto;
  }): Promise<BankAccount> {
    return this.repo.save(
      plainToClass(BankAccount, { ...bankAccount, ...input }),
    );
  }

  //----- EXAMPLE
  async createExampleData() {
    const result: BankAccount[] = [];
    for (let i = 0; i < 1000; i += 1) {
      const neoBankAccountInfor = new CreateBankAccountDto();
      neoBankAccountInfor.userName = faker.person.firstName();
      neoBankAccountInfor.bankNumber = faker.finance.accountNumber(12);
      neoBankAccountInfor.currency = faker.helpers.arrayElement(['VND', 'USD']);
      neoBankAccountInfor.balance = faker.number.float({
        min: 1000,
        max: 50000,
        fractionDigits: 2,
      });
      try {
        const newBankAccount = await this.create({
          input: neoBankAccountInfor,
        });
        result.push(newBankAccount);
      } catch (error) {
        continue;
      }
    }
    return result;
  }
}
