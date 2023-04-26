import { newMonetaryAmount } from '@interlay/interbtc-api';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Dd, DlGroup, Dt, Flex, TokenInput } from '@/component-library';
import { AccountSelect, AuthCTA } from '@/components';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import {
  CROSS_CHAIN_TRANSFER_AMOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_FROM_FIELD,
  CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_TO_FIELD,
  CROSS_CHAIN_TRANSFER_TOKEN_FIELD,
  CrossChainTransferFormData,
  crossChainTransferSchema,
  CrossChainTransferValidationParams,
  isFormDisabled,
  useForm
} from '@/lib/form';
import { useSubstrateSecureState } from '@/lib/substrate';
import { Chains } from '@/types/chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { useXCMBridge } from '@/utils/hooks/api/xcm/use-xcm-bridge';
import useAccountId from '@/utils/hooks/use-account-id';

import { ChainSelect } from './components';
import {
  ChainSelectSection,
  StyledArrowRightCircle,
  StyledDl,
  StyledSourceChainSelect
} from './CrossChainTransferForm.styles';

const CrossChainTransferForm = (): JSX.Element => {
  const [testChains, setTestChains] = useState<Chains>([]);
  const accountId = useAccountId();

  const { getBalance } = useGetBalances();
  const prices = useGetPrices();
  const { t } = useTranslation();
  const { data: XCMBridge } = useXCMBridge();

  const { accounts } = useSubstrateSecureState();

  useEffect(() => {
    if (!XCMBridge) return;

    const availableChains = XCMBridge.bridge.adapters.map((adapter: any) => {
      return {
        display: adapter.chain.display,
        id: adapter.chain.id
      };
    });

    setTestChains(availableChains);
  }, [XCMBridge]);

  const handleSubmit = () => {
    console.log('submit');
  };

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const balance = getBalance(GOVERNANCE_TOKEN.ticker)?.transferable;

  const schema: CrossChainTransferValidationParams = {
    [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: {
      governanceBalance,
      minAmount: newMonetaryAmount(1, GOVERNANCE_TOKEN),
      maxAmount: balance || newMonetaryAmount(0, GOVERNANCE_TOKEN),
      transactionFee: TRANSACTION_FEE_AMOUNT
    }
  };

  const form = useForm<CrossChainTransferFormData>({
    initialValues: {
      [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: '',
      [CROSS_CHAIN_TRANSFER_FROM_FIELD]: 'kintsugi',
      [CROSS_CHAIN_TRANSFER_TO_FIELD]: 'kusama',
      [CROSS_CHAIN_TRANSFER_TOKEN_FIELD]: 'KSM',
      [CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD]: accountId?.toString() || ''
    },
    onSubmit: handleSubmit,
    validationSchema: crossChainTransferSchema(schema, t)
  });

  useEffect(() => {
    if (!accountId) {
      return form.resetForm();
    }

    form.setFieldValue(CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD, accountId.toString());
    form.validateField(CROSS_CHAIN_TRANSFER_AMOUNT_FIELD);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const transferMonetaryAmount = newSafeMonetaryAmount(
    form.values[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD] || 0,
    GOVERNANCE_TOKEN,
    true
  );

  const valueUSD =
    convertMonetaryAmountToValueInUSD(transferMonetaryAmount, getTokenPrice(prices, GOVERNANCE_TOKEN.ticker)?.usd) ?? 0;

  const isCTADisabled = isFormDisabled(form);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <ChainSelectSection justifyContent='space-between'>
          <StyledSourceChainSelect
            label='Source Chain'
            chains={testChains}
            {...form.getFieldProps(CROSS_CHAIN_TRANSFER_FROM_FIELD)}
          />
          <StyledArrowRightCircle color='secondary' strokeWidth={2} />
          <ChainSelect
            label='Destination Chain'
            chains={testChains}
            {...form.getFieldProps(CROSS_CHAIN_TRANSFER_TO_FIELD)}
          />
        </ChainSelectSection>
        <div>
          <TokenInput
            placeholder='0.00'
            label='Transfer amount'
            balance={balance?.toString() || 0}
            humanBalance={balance?.toHuman() || 0}
            valueUSD={valueUSD}
            selectProps={form.getFieldProps(CROSS_CHAIN_TRANSFER_TOKEN_FIELD, false)}
            {...form.getFieldProps(CROSS_CHAIN_TRANSFER_AMOUNT_FIELD)}
          />
        </div>
        <AccountSelect
          label='Destination'
          accounts={accounts}
          {...form.getFieldProps(CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD, false)}
        />
        <StyledDl direction='column' gap='spacing2'>
          <DlGroup justifyContent='space-between'>
            <Dt size='xs' color='primary'>
              Origin chain transfer fee
            </Dt>
            <Dd size='xs'>0 DOT</Dd>
          </DlGroup>
          <DlGroup justifyContent='space-between'>
            <Dt size='xs' color='primary'>
              Destination chain transfer fee
            </Dt>
            <Dd size='xs'>0 INTR</Dd>
          </DlGroup>
        </StyledDl>
        <AuthCTA size='large' type='submit' disabled={isCTADisabled}>
          {t('transfer')}
        </AuthCTA>
      </Flex>
    </form>
  );
};

export default CrossChainTransferForm;
