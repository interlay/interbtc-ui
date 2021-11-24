import clsx from 'clsx';
import {
  BitcoinAmount,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

import DropDown from 'components/DropDown';

import {
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon,
  COLLATERAL_TOKEN_SYMBOL,
  CollateralTokenLogoIcon,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenLogoIcon
} from 'config/relay-chains';
import { displayMonetaryAmount } from 'common/utils/utils';

interface Props {
  wrappedTokenBalance?: BitcoinAmount;
  collateralTokenBalance?: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  governanceTokenBalance?: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
}

const Balances = ({
  wrappedTokenBalance,
  collateralTokenBalance,
  governanceTokenBalance
}: Props): JSX.Element => {
  const strCollateralTokenBalance = displayMonetaryAmount(collateralTokenBalance);
  const strWrappedTokenBalance = displayMonetaryAmount(wrappedTokenBalance);
  const strGovernanceTokenBalance = displayMonetaryAmount(governanceTokenBalance);

  return (
    <div
      className={clsx(
        'flex',
        'space-x-2'
      )}>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        <CollateralTokenLogoIcon
          fill='currentColor'
          height={30} />
      </div>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        <WrappedTokenLogoIcon
          fill='currentColor'
          width={30} />
      </div>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        <GovernanceTokenLogoIcon
          fill='currentColor'
          width={30} />
      </div>
      <DropDown
        options={[
          {
            label: `${strCollateralTokenBalance} ${COLLATERAL_TOKEN_SYMBOL}`,
            value: strCollateralTokenBalance
          },
          {
            label: `${strWrappedTokenBalance} ${WRAPPED_TOKEN_SYMBOL}`,
            value: strWrappedTokenBalance
          },
          {
            label: `${strGovernanceTokenBalance} ${GOVERNANCE_TOKEN_SYMBOL}`,
            value: strGovernanceTokenBalance
          }
        ]} />
    </div>
  );
};

export default Balances;
