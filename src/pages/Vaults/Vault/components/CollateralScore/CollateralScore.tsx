import { mergeProps } from '@react-aria/utils';
import { ReactNode, useState } from 'react';

import { formatPercentage } from '@/common/utils/utils';
import { Meter, MeterRanges, useMeter } from '@/component-library';
import { Status } from '@/component-library/utils/prop-types';

import { CollateralStatus } from '../../types';
import {
  StyledLabel,
  StyledLabelWrapper,
  StyledScore,
  StyledScoreWrapper,
  StyledSublabel,
  StyledWrapper
} from './CollateralScore.style';

// TODO: move from here so we keep formatOptions config in one place
const formatOptions: Intl.NumberFormatOptions = { style: 'decimal', maximumFractionDigits: 2 };

const getSublabel = (status: CollateralStatus, ranges: MeterRanges) => {
  switch (status) {
    case 'error':
      return `High Risk: ${ranges[0]}-${ranges[1]}%`;
    case 'warning':
      return `Medium Risk: ${ranges[1]}-${ranges[2]}%`;
    case 'success':
      return `Low Risk: ${ranges[2]}-${ranges[3]}%`;
  }
};

type CollateralScoreProps = {
  ranges: MeterRanges;
  score?: number;
  variant?: 'default' | 'highlight';
  label?: ReactNode;
  className?: string;
};

const CollateralScore = ({
  score,
  label,
  variant = 'default',
  ranges,
  ...props
}: CollateralScoreProps): JSX.Element => {
  const [status, setStatus] = useState<Status>('error');

  const isInfinity = score === undefined;

  const { labelProps, meterProps } = useMeter({
    label,
    value: isInfinity ? 999999999 : score,
    formatOptions,
    ranges
  });

  // Does not allow negative numbers
  const value = meterProps['aria-valuenow'] || 0;

  const isDefault = variant === 'default';

  const sublabel = getSublabel(status, ranges);

  const handleChange = (status: Status) => {
    setStatus(status);
  };

  return (
    <StyledWrapper {...mergeProps(meterProps, props)}>
      <StyledLabelWrapper isDefault={isDefault}>
        <StyledLabel {...labelProps} isDefault={isDefault}>
          {label}
        </StyledLabel>
        <StyledScoreWrapper isDefault={isDefault}>
          <StyledScore isDefault={isDefault} status={status}>
            {isInfinity ? '∞' : formatPercentage(value)}
          </StyledScore>
          <StyledSublabel isDefault={isDefault} status={isDefault ? status : undefined}>
            {sublabel}
          </StyledSublabel>
        </StyledScoreWrapper>
      </StyledLabelWrapper>
      <Meter value={value} ranges={ranges} onChange={handleChange} />
    </StyledWrapper>
  );
};

export { CollateralScore };
export type { CollateralScoreProps };
