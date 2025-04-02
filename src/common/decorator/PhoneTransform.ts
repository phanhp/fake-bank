import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { WhiteListPhonenumbers } from 'src/config';

export function TransformCanadaPhonenumber() {
  return applyDecorators(
    Transform(({ value }) => {
      if (WhiteListPhonenumbers.includes(value)) return value;
      if (value.startsWith('01')) return value;
      return '01' + value.substring(1);
    }),
  );
}
