import styled from 'styled-components';

import { hideScrollbar } from '../css';
import { theme } from '../theme';
import { Sizes } from '../utils/prop-types';

const StyledTabs = styled.div`
  display: block;
  width: 100%;
`;

type TabListWrapperProps = {
  $fullWith: boolean;
  $size: Exclude<Sizes, 'small'>;
};

const TabListWrapper = styled.div<TabListWrapperProps>`
  display: ${({ $fullWith }) => ($fullWith ? 'block' : 'inline-block')};
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
  $fullWith: boolean;
};

const TabList = styled.div<TabListProps>`
  display: ${({ $fullWith }) => ($fullWith ? 'flex' : 'inline-flex')};
`;

type StyledTabProps = {
  $fullWidth: boolean;
  $size: Exclude<Sizes, 'small'>;
};

const StyledTab = styled.div<StyledTabProps>`
  padding: ${({ $size }) => theme.tabs[$size].tab.padding};
  font-size: ${({ $size }) => theme.tabs[$size].tab.text};
  text-align: center;
  cursor: default;
  outline: none;
  border-radius: ${theme.rounded.rg};
  color: ${theme.tabs.color};
  // TODO: have this transition into theme
  transition: color 150ms;

  flex: ${({ $fullWidth }) => $fullWidth && '1'};

  &[aria-selected='true'] {
    color: ${theme.tabs.active.color};
  }
`;

type TabSelectionProps = {
  $isFocusVisible: boolean;
  $width: number;
  $transform: string;
  $size: Exclude<Sizes, 'small'>;
};

const TabSelection = styled.div<TabSelectionProps>`
  position: absolute;
  top: ${({ $size }) => theme.tabs[$size].selection.padding};
  bottom: ${({ $size }) => theme.tabs[$size].selection.padding};
  left: 0;
  border-radius: ${theme.rounded.rg};
  background-color: ${theme.tabs.active.bg};
  will-change: transform, width;
  // TODO: have this transition into theme
  transition: transform 150ms, width ${theme.transition.duration}ms;
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
