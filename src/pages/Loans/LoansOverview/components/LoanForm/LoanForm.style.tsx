import styled from 'styled-components';

import { Flex, theme } from '@/component-library';

type StyledFormWrapperProps = {
  $showBorrowLimit: boolean;
};

const StyledFormWrapper = styled(Flex)<StyledFormWrapperProps>`
  margin-top: ${theme.spacing.spacing8};
  // MEMO: keep the same height across each tab
  min-height: ${({ $showBorrowLimit }) => ($showBorrowLimit ? '32rem' : '20rem')};
`;

export { StyledFormWrapper };
