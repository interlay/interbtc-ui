import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { Flex, TokenInput } from '@/component-library';
import { AccountInput } from '@/components/AccountSelect';
import SubmitButton from '@/legacy-components/SubmitButton';
import { useSubstrateSecureState } from '@/lib/substrate';
import { useXCMBridge } from '@/utils/hooks/api/xcm/use-xcm-bridge';

import { ChainInput, Chains } from './components/SelectChainInput';

const CrossChainTransferForm = (): JSX.Element => {
  const [testChains, setTestChains] = useState<Chains>([]);

  const { t } = useTranslation();
  const { XCMBridge } = useXCMBridge();

  const { selectedAccount, accounts } = useSubstrateSecureState();
  const { parachainStatus } = useSelector((state: StoreType) => state.general);

  useEffect(() => {
    if (!XCMBridge) return;

    const availableChains = XCMBridge.adapters.map((adapter) => {
      return { display: adapter.chain.display, id: adapter.chain.id };
    });

    setTestChains(availableChains);
  }, [XCMBridge]);

  return (
    <>
      <form className='space-y-8'>
        <Flex direction='column' gap='spacing4'>
          <Flex direction='column' gap='spacing4' justifyContent='space-between'>
            {testChains.length && <ChainInput chains={testChains} />}
          </Flex>
          <div>
            <TokenInput
              placeholder='0.00'
              ticker={'KINT'}
              aria-label={t('forms.field_amount', {
                field: `KINT ${t('deposit').toLowerCase()}`
              })}
              balance={0}
              balanceDecimals={8}
              valueUSD={0}
              value={0}
              name={'KINT'}
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
              // onChange={handleChange}
              // errorMessage={'Error'}
            />
          </div>
          <AccountInput account={selectedAccount} accounts={accounts} />
          <SubmitButton disabled={parachainStatus === (ParachainStatus.Loading || ParachainStatus.Shutdown)}>
            {selectedAccount ? t('transfer') : t('connect_wallet')}
          </SubmitButton>
        </Flex>
      </form>
    </>
  );
};

export default CrossChainTransferForm;
