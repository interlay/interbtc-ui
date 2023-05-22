import clsx from 'clsx';

import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

interface Props {
  title: JSX.Element;
  unitIcon: JSX.Element;
  value: string; // TODO: should be number
  unitName: string;
  approxUSD: string; // TODO: should be number
  tooltip?: JSX.Element;
  className?: string;
  dataTestId?: string;
}

const PriceInfo = ({
  title,
  unitIcon,
  value,
  unitName,
  approxUSD,
  tooltip,
  className,
  dataTestId
}: Props): JSX.Element => (
  <div className={clsx('flex', 'justify-between', className)} data-testid={dataTestId}>
    <div className={clsx('flex', 'items-center', 'space-x-1')}>
      {title}
      {tooltip}
    </div>
    <div className={clsx('flex', 'flex-col', 'items-end')}>
      <div className={clsx('flex', 'items-center', 'space-x-1')}>
        {unitIcon}
        <span className='font-medium'>{value}</span>
        <span
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          {unitName}
        </span>
      </div>
      <span
        className={clsx(
          'block',
          { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}
      >
        {`≈ ${approxUSD}`}
      </span>
    </div>
  </div>
);

export default PriceInfo;
