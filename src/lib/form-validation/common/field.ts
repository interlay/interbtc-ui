import * as z from 'zod';

import { Validation } from '../types';

type ValidateRequiredFieldParams = {
  value: string;
};

const required: Validation<ValidateRequiredFieldParams> = {
  validate: ({ value }): boolean => !value,
  issue: () => ({
    code: z.ZodIssueCode.too_small,
    minimum: 1,
    inclusive: true,
    type: 'string'
  })
};

const field = {
  required
};

export default field;
export type { ValidateRequiredFieldParams };
