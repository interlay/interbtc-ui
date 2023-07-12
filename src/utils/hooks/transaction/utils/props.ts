import { TransactionFeeDetailsProps } from '@/components';

import { UseFeeEstimateResult } from '../hooks/use-fee-estimate';
import { Transaction } from '../types';

const getTransactionFeeDetailsProps = <T extends Transaction>(
  result: UseFeeEstimateResult<T>
): TransactionFeeDetailsProps => ({ ...result.data, selectProps: result.selectProps });

export { getTransactionFeeDetailsProps };
