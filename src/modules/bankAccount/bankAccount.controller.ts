import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankAccountService } from './bankAccount.service';

@ApiTags('bankAccounts')
@Controller('bankAccounts')
export class BankAccountController {
  constructor(private readonly service: BankAccountService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/example/create-base')
  createExample() {
    return this.service.createExampleData();
  }
}
