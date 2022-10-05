import styled from 'styled-components';

import { theme } from '../theme';
import { AlignItems, JustifyContent } from '../utils/prop-types';
import { Spacing } from './Stack';

const getSpacing = (spacing?: Spacing) => {
  let result;
  switch (spacing) {
    case 'none':
      break;
    case 'half':
      result = theme.spacing.spacing2;
      break;
    case 'single':
      result = theme.spacing.spacing4;
      break;
    case 'double':
      result = theme.spacing.spacing8;
      break;
    default:
      throw new Error('Something went wrong!');
  }

  return result;
};

type StackContainerProps = {
  $spacing: Spacing;
  $justifyContent?: JustifyContent;
  $alignItems?: AlignItems;
};

const StackContainer = styled.div<StackContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.$justifyContent};
  align-items: ${(props) => props.$alignItems};

  > *:not(:last-child) {
    margin-bottom: ${(props) => getSpacing(props.$spacing)};
  }
`;

export { StackContainer };
