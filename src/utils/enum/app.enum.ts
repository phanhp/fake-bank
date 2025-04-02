//----- BANK ACCOUNT
export enum EBankAccountStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED',
}

export enum EBankAccountCurrency {
  USD = 'USD',
  VND = 'VND',
}

//----- TRANSACTION
export enum ETransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum ETransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
}

//----- OTP
