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
  $isFilled: boolean;
  $position: number;
};

type StyledMarkTextProps = {
  $position: number;
};

type StyledControlsProps = {
  $hasMarks?: boolean;
};

type StyledSliderWrapperProps = {
  $isDisabled?: boolean;
};

const StyledSliderWrapper = styled(Flex)<StyledSliderWrapperProps>`
  width: 300px;
  cursor: ${({ $isDisabled }) => $isDisabled && 'default'};
  opacity: ${({ $isDisabled }) => $isDisabled && 0.5};
`;

const StyledControls = styled.div<StyledControlsProps>`
  position: relative;
  display: inline-block;
  vertical-align: top;
  width: 100%;
  min-height: 32px;
  margin-bottom: ${({ $hasMarks }) => $hasMarks && '20px'};
`;

const StyledBaseTrack = styled.div`
  display: block;
  position: absolute;
  top: 50%;
  height: ${theme.slider.track.size};
  transform: translateY(-50%);
  border-radius: ${theme.rounded.full};
`;

const StyledTrack = styled(StyledBaseTrack)`
  background-color: ${theme.slider.track.bg};
  width: 100%;
  z-index: 1;
`;

const StyledFilledTrack = styled(StyledBaseTrack)<StyledFilledTrackProps>`
  width: ${({ $percentage }) => `calc((100% * ${$percentage}))`};
  background-color: ${theme.slider.track.fillBg};
  z-index: 2;
`;

const StyledMark = styled.span<StyledMarkProps>`
  position: absolute;
  left: ${({ $position }) => `${$position}%`};
  top: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);

  width: ${theme.slider.mark.width};
  height: ${theme.slider.mark.height};

  background-color: ${({ $isFilled }) => ($isFilled ? theme.slider.track.fillBg : theme.slider.track.bg)};
  border-radius: ${theme.rounded.full};
`;

const StyledMarkText = styled(Span)<StyledMarkTextProps>`
  position: absolute;
  top: 35px;
  left: ${({ $position }) => `${$position}%`};
  transform: translateX(-50%);

  cursor: default;
`;

const StyledSliderThumb = styled.div<StyledSliderThumbProps>`
  height: ${theme.slider.thumb.size};
  width: ${theme.slider.thumb.size};

  top: 50%;
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
    height: ${theme.slider.thumb.size};
    width: ${theme.slider.thumb.size};
    border-radius: ${theme.rounded.full};
    transition: box-shadow ${theme.transition.duration.duration150}ms ease-in-out;

    ${({ $isFocusVisible }) =>
      $isFocusVisible &&
      css`
        box-shadow: 0 0 0 2px var(--colors-input-focus-border);
        height: 28px;
        width: 28px;
      `}
  }
`;

const StyledInput = styled.input`
  cursor: default;
  pointer-events: none;
  overflow: hidden;

  height: ${theme.slider.thumb.size};
  width: ${theme.slider.thumb.size};

  position: absolute;
  top: 50%;
  transform: translate(-20%, -20%);

  &:focus {
    outline: none;
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
