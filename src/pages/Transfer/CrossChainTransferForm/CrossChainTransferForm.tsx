import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Dd, DlGroup, Dt, Flex, TokenInput } from '@/component-library';
import { AccountSelect } from '@/components';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import SubmitButton from '@/legacy-components/SubmitButton';
import {
  CROSS_CHAIN_TRANSFER_AMOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_FROM_FIELD,
  CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_TO_FIELD,
  CROSS_CHAIN_TRANSFER_TOKEN_FIELD,
  CrossChainTransferFormData,
  useForm
} from '@/lib/form';
import { useSubstrateSecureState } from '@/lib/substrate';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { useXCMBridge } from '@/utils/hooks/api/xcm/use-xcm-bridge';
import useAccountId from '@/utils/hooks/use-account-id';

import { Chains, ChainSelect } from './components';
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
  const { XCMBridge } = useXCMBridge();

  const { selectedAccount, accounts } = useSubstrateSecureState();
  const { parachainStatus } = useSelector((state: StoreType) => state.general);

  useEffect(() => {
    if (!XCMBridge) return;

    const availableChains = XCMBridge.adapters.map((adapter: any) => {
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

  const form = useForm<CrossChainTransferFormData>({
    initialValues: {
      [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: '',
      [CROSS_CHAIN_TRANSFER_FROM_FIELD]: '',
      [CROSS_CHAIN_TRANSFER_TO_FIELD]: '',
      [CROSS_CHAIN_TRANSFER_TOKEN_FIELD]: 'KSM',
      [CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD]: accountId?.toString() || ''
    },
    onSubmit: handleSubmit
  });

  const transferTicker = form.values[CROSS_CHAIN_TRANSFER_TOKEN_FIELD];
  const balance = transferTicker ? getBalance(transferTicker)?.transferable : undefined;

  const transferMonetaryAmount = newSafeMonetaryAmount(
    form.values[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD] || 0,
    GOVERNANCE_TOKEN,
    true
  );

  const valueUSD = transferTicker
    ? convertMonetaryAmountToValueInUSD(transferMonetaryAmount, getTokenPrice(prices, transferTicker)?.usd) ?? 0
    : 0;

  return (
    <form className='space-y-8' onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <ChainSelectSection justifyContent='space-between'>
          <StyledSourceChainSelect
            label='Source Chain'
            chains={testChains}
            {...form.getFieldProps(CROSS_CHAIN_TRANSFER_FROM_FIELD, false)}
          />
          <StyledArrowRightCircle color='secondary' strokeWidth={2} />
          <ChainSelect
            label='Destination Chain'
            chains={testChains}
            {...form.getFieldProps(CROSS_CHAIN_TRANSFER_TO_FIELD, false)}
          />
        </ChainSelectSection>
        <div>
          <TokenInput
            placeholder='0.00'
            label='Transfer amount'
            balance={balance?.toString() || 0}
            humanBalance={balance?.toHuman() || 0}
            valueUSD={valueUSD}
            tokens={[
              {
                balance: 0,
                balanceUSD: '0',
                ticker: 'KSM'
              },
              {
                balance: 0,
                balanceUSD: '0',
                ticker: 'KINT'
              }
            ]}
            selectProps={form.getFieldProps(CROSS_CHAIN_TRANSFER_TOKEN_FIELD, false)}
            {...form.getFieldProps(CROSS_CHAIN_TRANSFER_AMOUNT_FIELD)}
          />
        </div>
        <AccountSelect
          label='Select Account'
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
        <SubmitButton disabled={parachainStatus === (ParachainStatus.Loading || ParachainStatus.Shutdown)}>
          {selectedAccount ? t('transfer') : t('connect_wallet')}
        </SubmitButton>
      </Flex>
    </form>
  );
};

export default CrossChainTransferForm;
