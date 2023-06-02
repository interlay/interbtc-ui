import { newMonetaryAmount } from '@interlay/interbtc-api';
import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';
import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Dd, Dl, DlGroup, Dt, Flex, P, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT, WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  BRIDGE_ISSUE_AMOUNT_FIELD,
  BRIDGE_ISSUE_VAULT_FIELD,
  BridgeIssueFormData,
  bridgeIssueSchema,
  isFormDisabled,
  useForm
} from '@/lib/form';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

import { TransactionDetails } from './TransactionDetails';

type IssueFormProps = { requestLimits: IssueLimits; dustValue: MonetaryAmount<Currency> };

const IssueForm = ({ requestLimits, dustValue }: IssueFormProps): JSX.Element => {
  const prices = useGetPrices();
  const { getBalance } = useGetBalances();

  const transaction = useTransaction(Transaction.TOKENS_TRANSFER, {
    onSuccess: () => {
      form.resetForm();
    }
  });

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const transferAmountSchemaParams = {
    governanceBalance,
    maxAmount: requestLimits.singleVaultMaxIssuable,
    minAmount: dustValue,
    transactionFee: TRANSACTION_FEE_AMOUNT
  };

  const handleSubmit = async (values: any) => {
    console.log(values);
  };

  const form = useForm<BridgeIssueFormData>({
    initialValues: {
      [BRIDGE_ISSUE_AMOUNT_FIELD]: '',
      [BRIDGE_ISSUE_VAULT_FIELD]: ''
    },
    validationSchema: bridgeIssueSchema({ [BRIDGE_ISSUE_AMOUNT_FIELD]: transferAmountSchemaParams }),
    onSubmit: handleSubmit,
    showErrorMessages: !transaction.isLoading
  });

  const monetaryAmount = newSafeMonetaryAmount(form.values[BRIDGE_ISSUE_AMOUNT_FIELD] || 0, WRAPPED_TOKEN, true);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const isBtnDisabled = isFormDisabled(form);

  return (
    <Flex direction='column'>
      <form onSubmit={form.handleSubmit}>
        <Flex direction='column' gap='spacing8'>
          <Flex direction='column' gap='spacing4'>
            <TokenInput
              placeholder='0.00'
              label='Amount'
              balanceLabel='Issuable'
              balance={requestLimits.singleVaultMaxIssuable.toString() || 0}
              humanBalance={requestLimits.singleVaultMaxIssuable.toHuman() || 0}
              ticker='BTC'
              valueUSD={amountUSD}
              {...mergeProps(form.getFieldProps(BRIDGE_ISSUE_AMOUNT_FIELD))}
            />
            <Flex direction='column' gap='spacing4'>
              <P align='center' size='xs'>
                Max Issuable
              </P>
              <Dl direction='column' gap='spacing1'>
                <DlGroup justifyContent='space-between' flex='1'>
                  <Dt size='xs' color='primary'>
                    In Single Request
                  </Dt>
                  <Dd size='xs'>
                    {requestLimits.singleVaultMaxIssuable.toHuman()}{' '}
                    {requestLimits.singleVaultMaxIssuable.currency.ticker}
                  </Dd>
                </DlGroup>
                <DlGroup justifyContent='space-between' flex='1'>
                  <Dt size='xs' color='primary'>
                    In Total
                  </Dt>
                  <Dd size='xs'>
                    {requestLimits.totalMaxIssuable.toHuman()} {requestLimits.totalMaxIssuable.currency.ticker}
                  </Dd>
                </DlGroup>
              </Dl>
            </Flex>
          </Flex>
          <Flex direction='column' gap='spacing4'>
            <TransactionDetails />
            <AuthCTA type='submit' disabled={isBtnDisabled} size='large' loading={transaction.isLoading}>
              Transfer
            </AuthCTA>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};

export { IssueForm };
export type { IssueFormProps };
