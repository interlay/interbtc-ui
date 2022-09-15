import { HTMLAttributes } from 'react';

import { formatPercentage } from '@/common/utils/utils';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';

import { ThresholdDd, ThresholdDl, ThresholdDt, ThresholdItem } from './VaultCollateral.styles';

type Props = {
  secureThreshold: VaultData['secureThreshold'];
  liquidationThreshold: VaultData['liquidationThreshold'];
  premiumRedeemThreshold: VaultData['premiumRedeemThreshold'];
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type CollateralThresholdsProps = Props & NativeAttrs;

const CollateralThresholds = ({
  liquidationThreshold,
  premiumRedeemThreshold,
  secureThreshold,
  ...props
}: CollateralThresholdsProps): JSX.Element => (
  <ThresholdDl {...props}>
    <ThresholdItem>
      <ThresholdDt>Liquidation Threshold</ThresholdDt>
      <ThresholdDd status='error'>
        {formatPercentage(liquidationThreshold.toNumber(), {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0
        })}
      </ThresholdDd>
    </ThresholdItem>
    <ThresholdItem>
      <ThresholdDt>Premium Redeem Threshold</ThresholdDt>
      <ThresholdDd status='warning'>
        {formatPercentage(premiumRedeemThreshold.toNumber(), {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0
        })}
      </ThresholdDd>
    </ThresholdItem>
    <ThresholdItem>
      <ThresholdDt>Secure threshold</ThresholdDt>
      <ThresholdDd status='success'>
        {formatPercentage(secureThreshold.toNumber(), {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0
        })}
      </ThresholdDd>
    </ThresholdItem>
  </ThresholdDl>
);

export { CollateralThresholds };
export type { CollateralThresholdsProps };
