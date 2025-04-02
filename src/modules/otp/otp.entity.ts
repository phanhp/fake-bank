import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class Otp extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ type: String })
  code: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ type: Date })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ type: Date })
  updatedAt: Date;

  //Transaction
  @OneToOne(() => Transaction, (transaction) => transaction.otp)
  transaction: Transaction;
}
