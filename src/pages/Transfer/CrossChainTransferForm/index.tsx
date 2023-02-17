import { ChainName } from '@interlay/bridge';
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
  const [destinationChains, setDestinationChains] = useState<Chains>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);

  const { t } = useTranslation();
  const { availableChains, getDestinationChains, getAvailableTokens } = useXCMBridge();

  useEffect(() => {
    if (!availableChains.length) return;

    const destinations = getDestinationChains(availableChains[0].id as ChainName);
    setDestinationChains(destinations);
  }, [availableChains, getDestinationChains]);

  useEffect(() => {
    if (!availableChains.length || !destinationChains.length) return;

    const tokens = getAvailableTokens(availableChains[0].id as ChainName, destinationChains[0].id as ChainName);
    setAvailableTokens(tokens);
  }, [availableChains, destinationChains, getAvailableTokens]);

  useEffect(() => {
    if (!availableTokens.length) return;

    console.log(availableTokens);
  }, [availableTokens]);

  const { selectedAccount, accounts } = useSubstrateSecureState();
  const { parachainStatus } = useSelector((state: StoreType) => state.general);

  return (
    <>
      <form className='space-y-8'>
        <Flex direction='column' gap='spacing4'>
          {availableChains.length && destinationChains.length && (
            <ChainInputs fromChains={availableChains} toChains={destinationChains} />
          )}
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
