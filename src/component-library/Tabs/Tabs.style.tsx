import styled from 'styled-components';

import { theme } from '../theme';

const TabListWrapper = styled.div`
  display: inline-block;
  position: relative;
  background-color: ${theme.tabs.bg};
  padding: ${theme.spacing.spacing1} ${theme.spacing.spacing2};
  border-radius: ${theme.rounded.md};
  border: ${theme.tabs.border};
  z-index: 0;
`;

const TabList = styled.div`
  display: inline-flex;
`;

const StyledTab = styled.div`
  padding: ${theme.spacing.spacing1} ${theme.spacing.spacing4};
  font-size: ${theme.text.xs};
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

type TabSelectionProps = { isFocusVisible: boolean; width: number; transform: string };

const TabSelection = styled.div<TabSelectionProps>`
  position: absolute;
  top: ${theme.spacing.spacing1};
  bottom: ${theme.spacing.spacing1};
  left: 0;
  border-radius: ${theme.rounded.rg};
  background-color: ${theme.tabs.active.bg};
  will-change: transform, width;
  // TODO: have this transition into theme
  transition: transform 150ms, width ${theme.transition.duration}ms;
  z-index: -1;

  width: ${(props) => props.width}px;
  transform: ${(props) => props.transform};

  ${(props) =>
    props.isFocusVisible &&
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

export { StyledTab, TabList, TabListWrapper, TabSelection };
