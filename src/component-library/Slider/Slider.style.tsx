import styled, { css } from 'styled-components';

import { Flex } from '../Flex';
import { Span } from '../Text';
import { theme } from '../theme';

type StyledSliderThumbProps = {
  $isHovered: boolean;
  $isDragged: boolean;
  $isFocused: boolean;
  $isFocusVisible: boolean;
};

type StyledFilledTrackProps = {
  $percentage: number;
};

type StyledMarkProps = {
  // $isFilled: number;
  $position: number;
};

type StyledMarkTextProps = {
  // $isFilled: number;
  $position: number;
};

const StyledSliderWrapper = styled(Flex)`
  width: 300px;
`;

const StyledInput = styled.input`
  cursor: default;
  pointer-events: none;
  overflow: hidden;
  height: 25px;
  width: 25px;
  top: 50%;

  &:focus {
    outline: none;
  }
`;

const StyledControls = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: top;
  width: calc(300px - 25px);
  min-height: 32px;
  margin-left: calc(25px / 2);

  &::before {
    content: '';
    position: absolute;
    left: -12.5px;
    width: 12.5px;
    height: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    right: -12.5px;
    width: 12.5px;
    height: 100%;
  }
`;

const StyledBaseTrack = styled.div`
  position: absolute;
  top: 50%;
  left: -12.5px;
  transform: translateY(-50%);
  height: 3px;
  display: block;
  border-radius: ${theme.rounded.full};
`;

const StyledTrack = styled(StyledBaseTrack)`
  background-color: ${theme.slider.track.bg};
  width: calc(100% + 25px);
  z-index: 1;
`;

const StyledFilledTrack = styled(StyledBaseTrack)<StyledFilledTrackProps>`
  width: ${({ $percentage }) => `calc((100% * ${$percentage}) + 12.5px)`};
  background-color: ${theme.slider.track.fillBg};
  z-index: 2;
`;

const StyledMark = styled.span<StyledMarkProps>`
  left: ${({ $position }) => $position};
  position: absolute;
  width: 2px;
  height: 6px;
  background-color: ${theme.slider.track.fillBg};
  z-index: 2;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const StyledMarkText = styled(Span)<StyledMarkTextProps>`
  left: ${({ $position }) => $position};
`;

const StyledSliderThumb = styled.div<StyledSliderThumbProps>`
  height: 25px;
  width: 25px;

  top: 50%;
  transform: translateY(-50%);
  z-index: 3;

  background-color: ${({ $isHovered }) => ($isHovered ? theme.slider.thumb.hover.bg : theme.slider.thumb.bg)};
  border-style: solid;
  border-color: ${theme.colors.textSecondary};
  border-width: ${({ $isDragged }) => ($isDragged ? '8px' : '2px')};
  border-radius: ${theme.rounded.full};
  transition: border-width ${theme.transition.duration.duration100}ms ease-in-out;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 25px;
    width: 25px;
    border-radius: ${theme.rounded.full};

    ${({ $isFocusVisible }) =>
      $isFocusVisible &&
      css`
        box-shadow: ${theme.boxShadow.focus};
        height: 28px;
        width: 28px;
      `}
  }
`;

export {
  StyledControls,
  StyledFilledTrack,
  StyledInput,
  StyledMark,
  StyledMarkText,
  StyledSliderThumb,
  StyledSliderWrapper,
  StyledTrack
};
