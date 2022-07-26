import styled from 'styled-components';

import { theme } from '../theme';

const TabListWrapper = styled.div`
  display: inline-block;
  position: relative;
  background-color: ${theme.tabs.bg};
  padding: ${theme.spacing.spacing1};
  border-radius: ${theme.rounded.xl};
  z-index: 0;
`;

const TabList = styled.div`
  display: inline-flex;
`;

const StyledTab = styled.div`
  padding: 8px ${theme.spacing.spacing10};
  font-size: 14px;
  font-weight: 600;
  cursor: default;
  outline: none;
  border-radius: 20px;
  color: #444;
  transition: color 150ms;

  &[aria-selected='true'] {
    color: white;
  }
`;

const TabSelection = styled.div`
  position: absolute;
  top: ${theme.spacing.spacing1};
  bottom: ${theme.spacing.spacing1};
  left: 0;
  border-radius: inherit;
  background: dodgerblue;
  will-change: transform, width;
  transition: transform 150ms, width 100ms;
`;

export { StyledTab, TabList, TabListWrapper, TabSelection };
