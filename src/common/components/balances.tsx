
import * as React from 'react';
import clsx from 'clsx';

import { safeRoundFiveDecimals } from 'common/utils/utils';
import { ReactComponent as PolkabtcLogoIcon } from 'assets/img/polkabtc-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';
import { ReactComponent as DropDownIcon } from 'assets/img/icons/drop-down.svg';

interface Props {
  balancePolkaBTC?: string;
  balanceDOT?: string;
}

const Balances = ({ balancePolkaBTC, balanceDOT }: Props): JSX.Element => {
  const roundedBalanceDot = safeRoundFiveDecimals(balanceDOT);
  const [dropDownStatus, setDropDownStatus] = React.useState(false);

  const DROPDOWN_ITEMS = [
    {
      currency: 'DOT',
      amount: roundedBalanceDot,
      logo: <PolkadotLogoIcon
        height={20}
        width={20} />
    }
  ];
  return (
    <div
      className={clsx(
        'mx-4', // TODO: should use space-x-{number} at upper level
        'max-w-max'
      )}>
      <div
        className={clsx(
          'relative',
          'flex',
          'items-center',
          'cursor-pointer'
        )}
        onClick={() => {
          setDropDownStatus(!dropDownStatus);
        }}>
        <div
          className={clsx(
            'flex',
            'items-center',
            'space-x-2',
            'px-2'
          )}>
          <div
            className={clsx(
              'flex',
              'items-center',
              'space-x-2'
            )}>
            <span className='text-lg'>{balancePolkaBTC || '0'}</span>
            <div
              className={clsx(
                'flex',
                'items-center',
                'space-x-2'
              )}>
              <PolkabtcLogoIcon
                fill='currentColor'
                width={50}
                height={30} />
              <span className='text-gray-500'>InterBTC</span>
            </div>
          </div>
        </div>
        <DropDownIcon
          width={20}
          height={20} />
        {dropDownStatus && (
          <div
            className={clsx(
              'm-1',
              'flex-col',
              'absolute',
              'top-full',
              'w-full',
              'bg-gray-100',
              'left-0'
            )}>
            {DROPDOWN_ITEMS.map(dropdownItem => (
              <div
                className={clsx(
                  'my-5',
                  'px-2'
                )}
                key={dropdownItem.currency}>
                <div
                  className={clsx(
                    'flex',
                    'justify-between',
                    'items-center',
                    'space-x-1'
                  )}>
                  <span className='text-lg'>{dropdownItem.amount ?? '0'}</span>
                  <div className='flex'>
                    {dropdownItem.logo}
                    <span
                      className={clsx(
                        'text-gray-500',
                        'ml-1'
                      )}>
                      {dropdownItem.currency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Balances;
