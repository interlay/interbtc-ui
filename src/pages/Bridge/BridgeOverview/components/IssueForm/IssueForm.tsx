import { newMonetaryAmount } from '@interlay/interbtc-api';
import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';
import { BitcoinAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { ChangeEvent, useState } from 'react';
import { useDebounce } from 'react-use';

import { convertMonetaryAmountToValueInUSD, newSafeBitcoinAmount, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Dd, Dl, DlGroup, Dt, Flex, P, Switch, TokenInput } from '@/component-library';
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
import { IssueData, useGetIssueData } from '@/utils/hooks/api/bridge/use-get-issue-data';
import { useGetVaults } from '@/utils/hooks/api/bridge/use-get-vaults';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

import { VaultSelect } from '../VaultSelect';
import { TransactionDetails } from './TransactionDetails';

const isInputOverRequestLimit = (inputAmount: BitcoinAmount, limits: IssueLimits) =>
  inputAmount.gt(limits.singleVaultMaxIssuable);

type IssueFormProps = { requestLimits: IssueLimits; data: IssueData };

// TODO: oracle down error
const IssueForm = ({ requestLimits, data }: IssueFormProps): JSX.Element => {
  const prices = useGetPrices();
  const { getBalance } = useGetBalances();
  const { getSecurityDeposit } = useGetIssueData();
  const [isSelectingVault, setSelectingVault] = useState(false);

  const [amount, setAmount] = useState<string>();

  const transaction = useTransaction(Transaction.TOKENS_TRANSFER, {
    onSuccess: () => {
      form.resetForm();
    }
  });

  const { getAvailableVaults } = useGetVaults({ action: 'issue', enabled: isSelectingVault });

  useDebounce(
    () => {
      if (!amount || !isSelectingVault) return;

      const monetaryAmount = newSafeBitcoinAmount(amount);
      const shouldShowVaults = !isInputOverRequestLimit(monetaryAmount, requestLimits);
      setSelectingVault(shouldShowVaults);
    },
    500,
    [amount, requestLimits]
  );

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  const transferAmountSchemaParams = {
    governanceBalance,
    maxAmount: requestLimits.singleVaultMaxIssuable,
    minAmount: data.dustValue,
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

  const handleChangeSelectingVault = (e: ChangeEvent<HTMLInputElement>) => setSelectingVault(e.target.checked);

  const handleChangeIssueAmount = (e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  const monetaryAmount = newSafeMonetaryAmount(form.values[BRIDGE_ISSUE_AMOUNT_FIELD] || 0, WRAPPED_TOKEN, true);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const isBtnDisabled = isFormDisabled(form);

  const securityDeposit = getSecurityDeposit(monetaryAmount) || new BitcoinAmount(0);
  const vaults = getAvailableVaults(monetaryAmount);

  const totalAmount = monetaryAmount.gte(data.issueFee) ? monetaryAmount.sub(data.issueFee) : undefined;
  const totalAmountUSD = totalAmount
    ? convertMonetaryAmountToValueInUSD(totalAmount, getTokenPrice(prices, totalAmount.currency.ticker)?.usd) || 0
    : 0;

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
              {...mergeProps(form.getFieldProps(BRIDGE_ISSUE_AMOUNT_FIELD), { onChange: handleChangeIssueAmount })}
            />
            <TokenInput
              placeholder='0.00'
              label='You will receive'
              isDisabled
              ticker={WRAPPED_TOKEN.ticker}
              value={totalAmount?.toString()}
              valueUSD={totalAmountUSD}
            />
            <Switch isSelected={isSelectingVault} onChange={handleChangeSelectingVault}>
              Manually Select Vault
            </Switch>
            {isSelectingVault && vaults && <VaultSelect items={vaults} />}
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
            <TransactionDetails issueFee={data.issueFee} securityDeposit={securityDeposit} />
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
