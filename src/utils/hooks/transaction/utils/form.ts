import { isFormDisabled, useForm } from '@/lib/form';

import { Transaction } from '../types';
import { UseFeeEstimateResult } from '../types/hook';

const isTransactionFormDisabled = <T extends Transaction>(
  form: ReturnType<typeof useForm>,
  fee: UseFeeEstimateResult<T>
): boolean => isFormDisabled(form) || fee.isLoading || !(fee.data && fee.data.isValid);

export { isTransactionFormDisabled };
