import styled from 'styled-components';

import { hideScrollbar } from '../css';
import { theme } from '../theme';
import { AlignItems, Sizes } from '../utils/prop-types';

const StyledTabs = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type TabListWrapperProps = {
  $fullWidth: boolean;
  $size: Sizes;
  $align: AlignItems;
};

const TabListWrapper = styled.div<TabListWrapperProps>`
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  align-self: ${({ $align, $fullWidth }) => !$fullWidth && $align};
  position: relative;
  background-color: ${theme.tabs.bg};
  padding: ${({ $size }) => theme.tabs[$size].wrapper.padding};
  border-radius: ${theme.rounded.md};
  border: ${theme.tabs.border};
  z-index: 0;
  max-width: 100%;
  overflow-x: auto;
  ${hideScrollbar()}
`;

type TabListProps = {
  $fullWidth: boolean;
};

const TabList = styled.div<TabListProps>`
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  width: 100%;
`;

type StyledTabProps = {
  $fullWidth: boolean;
  $size: Sizes;
};

const StyledTab = styled.div<StyledTabProps>`
  flex: ${({ $fullWidth }) => $fullWidth && '1'};
  padding: ${({ $size }) => theme.tabs[$size].tab.padding};
  font-size: ${({ $size }) => theme.tabs[$size].tab.text};
  font-weight: ${({ $size }) => theme.tabs[$size].tab.fontWeight};
  text-align: center;
  cursor: default;
  outline: none;
  border-radius: ${theme.rounded.rg};
  color: ${theme.tabs.color};
  // TODO: have this transition into theme
  transition: color 150ms;

  &[aria-selected='true'] {
    color: ${theme.tabs.active.color};
  }
`;

type TabSelectionProps = {
  $isFocusVisible: boolean;
  $width: number;
  $transform: string;
  $size: Sizes;
};

const TabSelection = styled.div<TabSelectionProps>`
  position: absolute;
  top: ${({ $size }) => theme.tabs[$size].selection.padding};
  bottom: ${({ $size }) => theme.tabs[$size].selection.padding};
  left: 0;
  border-radius: ${theme.rounded.rg};
  background-color: ${theme.tabs.active.bg};
  will-change: transform, width;
  transition: transform ${theme.transition.duration.duration150}ms, width ${theme.transition.duration.duration100}ms;
  z-index: -1;

  width: ${(props) => props.$width}px;
  transform: ${(props) => props.$transform};

  ${(props) =>
    props.$isFocusVisible &&
    `&:after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: ${theme.rounded.md};
    border: 2px solid ${theme.tabs.active.bg};
    z-index: 3;
  }`}
`;

export { StyledTab, StyledTabs, TabList, TabListWrapper, TabSelection };
