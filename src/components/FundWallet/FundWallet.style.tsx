import styled from 'styled-components';

import { CTA, Flex, Tabs, theme } from '@/component-library';

const StyledTabs = styled(Tabs)`
  padding: ${theme.spacing.spacing2} ${theme.modal.header.paddingX} ${theme.modal.footer.paddingBottom};
`;

const StyledWrapper = styled(Flex)`
  margin-top: ${theme.spacing.spacing6};
`;

const StyledEntities = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr;

  grid-gap: ${theme.spacing.spacing1};
`;

const StyledEntitiesItem = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.spacing8};
  width: 100%;
  border: ${theme.border.default};
  background-color: ${theme.card.bg.secondary};
  border-radius: 12px;
  max-height: 120px;

  grid-column: span 2 / span 2;

  &:only-child {
    grid-column: span 4 / span 4;
  }

  &:not(:only-child):nth-child(odd):last-child {
    grid-column: 2 / span 2;
  }

  &:hover {
    border: ${theme.border.hover};
  }

  &:focus {
    border: ${theme.border.focus};
    box-shadow: ${theme.boxShadow.focus};
  }
`;

const StyledCTA = styled(CTA)`
  padding: ${theme.spacing.spacing3};
`;

export { StyledCTA, StyledEntities, StyledEntitiesItem, StyledTabs, StyledWrapper };
