import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './transaction.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post('/withdraw')
  async withdraw(@Body() transactionDto: CreateTransactionDto) {
    return this.service.createWithdrawTransaction({
      amount: transactionDto.amount,
      bankNumber: transactionDto.remitterBankNumber || '',
    });
  }

  @Post('/deposit')
  async deposit(@Body() transactionDto: CreateTransactionDto) {
    return this.service.createDepositTransaction({
      amount: transactionDto.amount,
      bankNumber: transactionDto.beneficiaryBankNumber || '',
    });
  }

  @Post('/transfer')
  async transfer(@Body() transactionDto: CreateTransactionDto) {
    return this.service.createTransferTransaction({
      amount: transactionDto.amount,
      beneficiaryBankNumber: transactionDto.beneficiaryBankNumber || '',
      remitterBankNumber: transactionDto.remitterBankNumber || '',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/example/create-base')
  createExample() {
    // return this.service.createExampleData();
  }
}
