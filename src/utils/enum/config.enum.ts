export enum EAppConfig {
  DATA_SOURCE = 'DATA_SOURCE',
}

export enum ERepository {
  BANK_ACCOUNT = 'BANK_ACCOUNT_REPOSITORY',
  TRANSACTION = 'TRANSACTION_REPOSITORY',
  BALANCE = 'BALANCE_REPOSITORY',
  OTP = 'OTP_REPOSITORY',
}

export enum EQueryBuilderAlias {
  BANK_ACCOUNT = 'bankAccount',
  TRANSACTION = 'transaction',
  OTP = 'otp',
  blance = 'balance',
}

// ----- SEARCH PARAM
export enum ESearchParam {
  EQUAL = '$eq',
  NOT_EQUAL = '$ne',
  GREATER_THAN = '$gt',
  LOWER_THAN = '$lt',
  GREATER_THAN_OR_EQUAL = '$gte',
  LOWER_THAN_OR_EQUAL = '$lte',
  START_WITH = '$starts',
  END_WITH = '$ends',
  CONTAINS = '$cont',
  NOT_CONTAINS = '$excl',
  IN = '$in',
  NOT_IN = '$notin',
  IS_NULL = '$isnull',
  IS_NOT_NULL = '$notnull',
  BETWEEN = '$between',
  EQUAL_IGNORE_CASE = '$eqL',
  NOT_EQUAL_IGNORE_CASE = '$neL',
  START_WITH_IGNORE_CASE = '$startsL',
  END_WITH_IGNORE_CASE = '$endsL',
  CONTAINS_IGNORE_CASE = '$contL',
  NOT_CONTAINS_IGNORE_CASE = '$exclL',
  IN_RANGE_INGORE_CASE = '$inL',
  NOT_IN_RANGE_IGNORE_CASE = '$notinL',
}
