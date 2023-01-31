import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { Flex, TokenInput } from '@/component-library';
import Accounts from '@/components/Accounts';
import SubmitButton from '@/components/SubmitButton';
import { useSubstrateSecureState } from '@/lib/substrate';

const CrossChainTransferForm = (): JSX.Element => {
  const { t } = useTranslation();

  const { selectedAccount } = useSubstrateSecureState();
  const { parachainStatus } = useSelector((state: StoreType) => state.general);

  return (
    <>
      <form className='space-y-8'>
        <Flex direction='row' gap='spacing4' justifyContent='space-between'></Flex>
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
        <Accounts label={t('transfer_page.cross_chain_transfer_form.target_account')} />
        <SubmitButton disabled={parachainStatus === (ParachainStatus.Loading || ParachainStatus.Shutdown)}>
          {selectedAccount ? t('transfer') : t('connect_wallet')}
        </SubmitButton>
      </form>
    </>
  );
};

export default CrossChainTransferForm;
