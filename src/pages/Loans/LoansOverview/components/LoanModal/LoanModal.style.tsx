import styled from 'styled-components';

import { Flex, Tabs, theme } from '@/component-library';

const StyledTabs = styled(Tabs)`
  margin-top: ${theme.spacing.spacing6};
`;

const StyledWrapper = styled.div`
  margin-top: ${theme.spacing.spacing6};
`;

type StyledFormWrapperProps = {
  $showBorrowLimit: boolean;
};

const StyledFormWrapper = styled(Flex)<StyledFormWrapperProps>`
  margin-top: ${theme.spacing.spacing8};
  // MEMO: keep the same height across each tab
  min-height: ${({ $showBorrowLimit }) => ($showBorrowLimit ? '32rem' : '20rem')};
`;

export { StyledFormWrapper, StyledTabs, StyledWrapper };
