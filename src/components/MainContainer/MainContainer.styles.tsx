import styled from 'styled-components';

import { Flex, theme } from '@/component-library';

const StyledContainer = styled(Flex)`
  padding: ${theme.spacing.spacing4};
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  @media ${theme.breakpoints.up('sm')} {
    max-width: ${theme.breakpoints.values.sm}px;
  }

  @media ${theme.breakpoints.up('md')} {
    max-width: ${theme.breakpoints.values.md}px;
  }

  @media ${theme.breakpoints.up('lg')} {
    padding: ${theme.spacing.spacing6};
    max-width: ${theme.breakpoints.values.lg}px;
  }

  @media ${theme.breakpoints.up('xl')} {
    max-width: ${theme.breakpoints.values.xl}px;
  }
`;

export { StyledContainer };
