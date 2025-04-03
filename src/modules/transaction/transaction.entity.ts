import { ApiProperty } from '@nestjs/swagger';
import { ETransactionStatus } from 'src/utils/enum/app.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BankAccount } from '../bankAccount/bankAccount.entity';
import { Otp } from '../otp/otp.entity';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column({ type: 'float', nullable: false, default: 0 })
  @ApiProperty({ type: Number })
  amount: number;

  @Column({
    type: 'text',
    nullable: false,
    default: ETransactionStatus.PENDING,
  })
  @ApiProperty({ type: String })
  status: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  @ApiProperty({ type: Number })
  type: string;

  @Column({
    type: 'text',
    nullable: true,
    default: '',
  })
  @ApiProperty({ type: String })
  description: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ type: Date })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ type: Date })
  updatedAt: Date;

  //BankAccount
  @ManyToOne(
    () => BankAccount,
    (bankAccount) => bankAccount.depositTransactions,
  )
  beneficiaryBankAccount: BankAccount;

  @ManyToOne(
    () => BankAccount,
    (bankAccount) => bankAccount.withdrawTransactions,
  )
  remitterBankAccount: BankAccount;

  //Otp
  @OneToOne(() => Otp, (otp) => otp.transaction)
  @JoinColumn()
  otp: Otp;
}
