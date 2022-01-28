
import clsx from 'clsx';

import Title from './Title';
import BalancesUI from './BalancesUI';
import UnstakeButton from './UnstakeButton';
import GovernanceTokenBalanceUI from './GovernanceTokenBalanceUI';
import InformationUI from './InformationUI';
import ExtendLockTimeUI from './ExtendLockTimeUI';
import MainContainer from 'parts/MainContainer';
import Panel from 'components/Panel';
import TokenField from 'components/TokenField';
import SubmitButton from 'components/SubmitButton';
import {
  GOVERNANCE_TOKEN_SYMBOL,
  VOTE_GOVERNANCE_TOKEN_SYMBOL
} from 'config/relay-chains';

const STAKING_GOVERNANCE_TOKEN_AMOUNT = 'staking-governance-token-amount';

const Staking = (): JSX.Element => {
  return (
    <MainContainer>
      <Panel
        className={clsx(
          'mx-auto',
          'w-full',
          'md:max-w-xl',
          'p-8',
          'space-y-8'
        )}>
        <Title />
        <BalancesUI />
        <UnstakeButton />
        <div className='space-y-2'>
          <GovernanceTokenBalanceUI balance='245.535' />
          <TokenField
            id={STAKING_GOVERNANCE_TOKEN_AMOUNT}
            name={STAKING_GOVERNANCE_TOKEN_AMOUNT}
            label={GOVERNANCE_TOKEN_SYMBOL}
            approxUSD='≈ $ 325.12'
            defaultValue='14.00' />
        </div>
        <ExtendLockTimeUI />
        <InformationUI
          label='New unlock date'
          value='Dec 16, 2023'
          tooltip='Your original lock date plus the extended lock time.' />
        <InformationUI
          label='New total stake'
          value={`40.00 ${VOTE_GOVERNANCE_TOKEN_SYMBOL}`}
          tooltip='Your total stake after this transaction.' />
        <InformationUI
          label='Estimated APY'
          value='12.24%'
          // eslint-disable-next-line max-len
          tooltip={`The estimated amount of KINT you will receive as rewards. Depends on your proportion of the total ${VOTE_GOVERNANCE_TOKEN_SYMBOL}.`} />
        <InformationUI
          label={`Estimated ${GOVERNANCE_TOKEN_SYMBOL} Rewards`}
          value={`156.43  ${GOVERNANCE_TOKEN_SYMBOL}`}
          tooltip={`The APY may change as the amount of total ${VOTE_GOVERNANCE_TOKEN_SYMBOL} changes`} />
        <SubmitButton>
          Add more stake
        </SubmitButton>
      </Panel>
    </MainContainer>
  );
};

export default Staking;
