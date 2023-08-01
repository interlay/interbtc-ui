import styled from 'styled-components';

import { Flex } from '../Flex';
import { theme } from '../theme';

type StyledSliderThumbWrapperProps = {
  $isHovered: boolean;
  $isDragged: boolean;
  $isFocused: boolean;
  $isFocusVisible: boolean;
};

const StyledSliderWrapper = styled(Flex)`
  width: 300px;
`;

const StyledSliderThumbWrapper = styled.div<StyledSliderThumbWrapperProps>`
  height: 25px;
  width: 25px;

  top: 50%;
  transform: translateY(-50%);

  background-color: ${theme.colors.bgPrimary};
  border-style: solid;
  border-color: ${theme.colors.textSecondary};
  border-width: ${({ $isDragged }) => ($isDragged ? '8px' : '2px')};
  border-radius: ${theme.rounded.full};
  transition: border-width ${theme.transition.duration.duration100}ms ease-in-out;
`;

const StyledInput = styled.input``;

const StyledTrack = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: top;
  width: 100%;
  min-height: 32px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 3px;
    display: block;
    background-color: ${theme.colors.textTertiary};
  }
`;

// is-hovered is-dragged is-tophandle
export { StyledInput, StyledSliderThumbWrapper, StyledSliderWrapper, StyledTrack };
