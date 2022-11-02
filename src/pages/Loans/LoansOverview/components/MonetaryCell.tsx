import { Span, Stack } from '@/component-library';

import { StyledSubLabel } from './LoansMarkets.style';

type MonetaryCellProps = {
  label?: string;
  sublabel?: string;
};

const MonetaryCell = ({ label, sublabel }: MonetaryCellProps): JSX.Element => (
  <Stack spacing='none'>
    <Span>{label}</Span>
    <StyledSubLabel color='tertiary'>{sublabel}</StyledSubLabel>
  </Stack>
);

export { MonetaryCell };
export type { MonetaryCellProps };
