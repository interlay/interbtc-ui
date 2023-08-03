import styled from 'styled-components';

import { Span } from '../Text';
import { theme } from '../theme';

type StyledBreadcrumbProps = {
  $isDisabled?: boolean;
};

const StyledNav = styled.nav``;

const StyledList = styled.ul`
  flex-wrap: nowrap;
  flex: 1 0;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
`;

const StyledListItem = styled.li`
  justify-content: flex-start;
  align-items: center;
  display: inline-flex;
  position: relative;
`;

const StyledBreadcrumb = styled(Span)<StyledBreadcrumbProps>`
  padding: 0 ${theme.spacing.spacing2};
`;

export { StyledBreadcrumb, StyledList, StyledListItem, StyledNav };
