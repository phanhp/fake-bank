import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EBankAccountCurrency } from 'src/utils/enum/app.enum';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class BankAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column({ type: 'text' })
  @ApiProperty({ type: String })
  userName: string;

  @Column({ type: 'text' })
  @ApiProperty({ type: String })
  bankNumber: string;

  @Column({ type: 'float', nullable: false, default: 0 })
  @ApiProperty({ type: Number })
  balance: number;

  @Column({
    type: 'text',
    nullable: false,
    default: EBankAccountCurrency.USD,
  })
  @ApiProperty({ type: String })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ type: Object })
  custom: any;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ type: Date })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ type: Date })
  updatedAt: Date;

  //Transaction
  @OneToMany(
    () => Transaction,
    (transaction) => transaction.beneficiaryBankAccount,
  )
  @ApiProperty({ type: Object })
  depositTransactions: Transaction[];

  @OneToMany(
    () => Transaction,
    (bankTransaction) => bankTransaction.remitterBankAccount,
  )
  @ApiProperty({ type: Object })
  withdrawTransactions: Transaction[];
}
