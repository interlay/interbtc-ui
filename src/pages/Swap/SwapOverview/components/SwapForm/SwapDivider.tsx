import { Divider } from '@/component-library';

import { StyledCTA, StyledWrapper } from './SwapForm.style';

// TODO: move to new PR for coins
const ArrowsUpDown = () => (
  <svg
    width='1.5em'
    height='1.5em'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
    />
  </svg>
);

type SwapDividerProps = {
  onClickSwitch: () => void;
};

// TODO: make it a button icon
const SwapDivider = ({ onClickSwitch }: SwapDividerProps): JSX.Element | null => (
  <StyledWrapper>
    <Divider orientation='horizontal' color='tertiary' />
    <StyledCTA variant='text' onClick={onClickSwitch}>
      <ArrowsUpDown />
    </StyledCTA>
  </StyledWrapper>
);

export { SwapDivider };
export type { SwapDividerProps };
