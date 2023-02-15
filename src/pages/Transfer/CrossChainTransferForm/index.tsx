import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { Dd, DlGroup, Dt, Flex, TokenInput } from '@/component-library';
import { AccountInput } from '@/components/AccountSelect';
import SubmitButton from '@/legacy-components/SubmitButton';
import { useSubstrateSecureState } from '@/lib/substrate';
import { useXCMBridge } from '@/utils/hooks/api/xcm/use-xcm-bridge';

import { ChainInputs } from './components/ChainInputs';
import { Chains } from './components/ChainSelect';
import { StyledDl } from './CrossChainTransferForm.styles';

const CrossChainTransferForm = (): JSX.Element => {
  const [testChains, setTestChains] = useState<Chains>([]);

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

  return (
    <>
      <form className='space-y-8'>
        <Flex direction='column' gap='spacing4'>
          {testChains.length && <ChainInputs testChains={testChains} />}
          <div>
            <TokenInput
              placeholder='0.00'
              ticker={'KINT'}
              aria-label={t('forms.field_amount', {
                field: `KINT ${t('deposit').toLowerCase()}`
              })}
              balance={0}
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
    </>
  );
};

export default CrossChainTransferForm;
