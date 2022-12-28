import styled from 'styled-components';

import { ReactComponent as ChevronDown } from '@/assets/img/icons/chevron-down.svg';

import { H3 } from '../Text';
import { theme } from '../theme';

type StyledAccordionItemWrapperProps = {
  $isOpen: boolean;
  $isDisabled: boolean;
};

type StyledAccordionItemButtonProps = {
  $isHovered: boolean;
};

const StyledAccordionItemWrapper = styled.div<StyledAccordionItemWrapperProps>`
  z-index: inherit;
  position: relative;
`;

const StyledAccordionItemHeading = styled(H3)`
  margin: 0;
`;

const StyledAccordionItemButton = styled.button<StyledAccordionItemButtonProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.spacing4} ${theme.spacing.spacing2};
  min-height: 0;
  text-overflow: ellipsis;
  cursor: default;
  appearance: none;
  background-color: inherit;
  border: 0;
  width: 100%;
  color: inherit;
`;

const StyledChevronDown = styled(ChevronDown)<Pick<StyledAccordionItemWrapperProps, '$isOpen'>>`
  width: 1.5em;
  height: 1.5em;
  display: inline-block;
  transform: ${({ $isOpen }) => $isOpen && 'rotate(-90deg)'};
  transition: transform ${theme.transition.duration.duration150}ms ease;
`;

const StyledAccordionItemRegion = styled.div`
  padding: 0 ${theme.spacing.spacing4} ${theme.spacing.spacing4} ${theme.spacing.spacing4};
`;

export {
  StyledAccordionItemButton,
  StyledAccordionItemHeading,
  StyledAccordionItemRegion,
  StyledAccordionItemWrapper,
  StyledChevronDown
};
