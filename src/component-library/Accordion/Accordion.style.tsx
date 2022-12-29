import styled from 'styled-components';

import { ReactComponent as ChevronDown } from '@/assets/img/icons/chevron-down.svg';

import { H3 } from '../Text';
import { theme } from '../theme';

type StyledAccordionProps = {
  $isDisabled: boolean;
  $isExpanded: boolean;
};

const StyledAccordionItemWrapper = styled.div<Pick<StyledAccordionProps, '$isDisabled'>>`
  z-index: inherit;
  position: relative;
  opacity: ${({ $isDisabled }) => $isDisabled && '0.5'};
`;

const StyledAccordionItemHeading = styled(H3)`
  margin: 0;
  font-weight: ${theme.fontWeight.bold};
`;

const StyledAccordionItemButton = styled.button<Pick<StyledAccordionProps, '$isDisabled'>>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.spacing4};
  min-height: 3.25rem;
  text-overflow: ellipsis;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'default' : 'pointer')};
  appearance: none;
  background-color: inherit;
  border: 0;
  width: 100%;
  color: inherit;
  font: inherit;
`;

const StyledChevronDown = styled(ChevronDown)<Pick<StyledAccordionProps, '$isExpanded'>>`
  width: 1.5em;
  height: 1.5em;
  display: inline-block;
  transform: ${({ $isExpanded }) => $isExpanded && 'rotate(-90deg)'};
  transition: transform ${theme.transition.duration.duration150}ms ease;
`;

const StyledAccordionItemRegion = styled.div<Pick<StyledAccordionProps, '$isExpanded'>>`
  padding: 0 ${theme.spacing.spacing4} ${theme.spacing.spacing4} ${theme.spacing.spacing4};
  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};
`;

export {
  StyledAccordionItemButton,
  StyledAccordionItemHeading,
  StyledAccordionItemRegion,
  StyledAccordionItemWrapper,
  StyledChevronDown
};
