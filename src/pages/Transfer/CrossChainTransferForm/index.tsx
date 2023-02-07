import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { Flex, TokenInput } from '@/component-library';
import { AccountInput } from '@/components/AccountSelect';
import SubmitButton from '@/legacy-components/SubmitButton';
import { useSubstrateSecureState } from '@/lib/substrate';

import { ChainInput } from './components/SelectChainInput';

const CrossChainTransferForm = (): JSX.Element => {
  const { t } = useTranslation();

  const { selectedAccount, accounts } = useSubstrateSecureState();
  const { parachainStatus } = useSelector((state: StoreType) => state.general);

  return (
    <>
      <form className='space-y-8'>
        <Flex direction='column' gap='spacing4'>
          <Flex direction='column' gap='spacing4' justifyContent='space-between'>
            <ChainInput />
            <ChainInput />
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
