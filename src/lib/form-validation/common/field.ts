import Big from 'big.js';
import * as z from 'zod';

import { Validation } from '../types';

type RequiredFieldValidationParams = {
  value: string;
};

type RequiredFieldIssueParams = {
  fieldName: string;
};

const required: Validation<RequiredFieldValidationParams, RequiredFieldIssueParams> = {
  validate: ({ value }): boolean => !!value,
  issue: (t, params) => ({
    code: z.ZodIssueCode.too_small,
    minimum: 1,
    inclusive: true,
    type: 'string',
    message: t('forms.please_enter_your_field', { field: params?.fieldName })
  })
};

type MinFieldValidationParams = {
  minAmount: Big;
  inputAmount: Big;
};

type MinFieldIssueParams = {
  action: string;
  amount: number | string;
};

const min: Validation<MinFieldValidationParams, MinFieldIssueParams> = {
  validate: ({ inputAmount, minAmount }): boolean => inputAmount.gte(minAmount),
  issue: (t, params) => ({
    code: z.ZodIssueCode.too_small,
    minimum: 1,
    inclusive: true,
    type: 'string',
    message: t('forms.amount_must_be_at_least', { action: params?.action, amount: params?.amount })
  })
};

type MaxFieldValidationParams = {
  maxAmount: Big;
  inputAmount: Big;
};

type MaxFieldIssueParams = {
  action: string;
  amount: number | string;
};

const max: Validation<MaxFieldValidationParams, MaxFieldIssueParams> = {
  validate: ({ inputAmount, maxAmount }): boolean => inputAmount.lte(maxAmount),
  issue: (t, params) => ({
    code: z.ZodIssueCode.too_small,
    minimum: 1,
    inclusive: true,
    type: 'string',
    message: t('forms.amount_must_be_at_most', { action: params?.action, amount: params?.amount })
  })
};

const field = {
  required,
  min,
  max
};

export default field;
export type {
  MaxFieldIssueParams,
  MaxFieldValidationParams,
  MinFieldIssueParams,
  MinFieldValidationParams,
  RequiredFieldIssueParams,
  RequiredFieldValidationParams
};
