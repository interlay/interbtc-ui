import styled from 'styled-components';

import { List, theme } from '@/component-library';

type StyledCircleProps = {
  $isFocusVisible: boolean;
};

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledCircle = styled.button<StyledCircleProps>`
  display: inline-flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: ${theme.spacing.spacing2};
  background-color: var(--colors-border);
  border-radius: ${theme.rounded.full};
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};
  transition: transform ${theme.transition.duration.duration150}ms ease-in;

  &:hover,
  &:focus-visible {
    transform: translate(-50%, -50%) rotate(180deg);
  }
`;

const StyledBackground = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: ${theme.spacing.spacing1} ${theme.spacing.spacing8};
  background-color: ${theme.colors.bgPrimary};
`;

const StyledList = styled(List)`
  font-size: ${theme.text.xs};
`;

export { StyledBackground, StyledCircle, StyledList, StyledWrapper };
