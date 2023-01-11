import styled from 'styled-components';

import { ChevronDown } from '@/assets/icons';

import { H3 } from '../Text';
import { theme } from '../theme';

type StyledAccordionProps = {
  $isDisabled: boolean;
  $isExpanded: boolean;
};

type StyledAccordionItemButtonProps = {
  $isDisabled: boolean;
  $isFocusVisible: boolean;
};

type StyledAccordionItemRegionProps = {
  $height: number;
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

const StyledAccordionItemButton = styled.button<StyledAccordionItemButtonProps>`
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
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};
`;

const StyledChevronDown = styled(ChevronDown)<Pick<StyledAccordionProps, '$isExpanded'>>`
  transform: ${({ $isExpanded }) => $isExpanded && 'rotate(-90deg)'};
  transition: transform ${theme.transition.duration.duration150}ms ease;
`;

const StyledAccordionItemRegion = styled.div<StyledAccordionItemRegionProps>`
  overflow: hidden;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  height: ${({ $isExpanded, $height }) => ($isExpanded ? `${$height}px` : 0)};
  transition: height 200ms ease 0ms, opacity 300ms ease 0ms;
`;

const StyledAccordionItemContent = styled.div`
  padding: 0 ${theme.spacing.spacing4} ${theme.spacing.spacing4} ${theme.spacing.spacing4};
`;

export {
  StyledAccordionItemButton,
  StyledAccordionItemContent,
  StyledAccordionItemHeading,
  StyledAccordionItemRegion,
  StyledAccordionItemWrapper,
  StyledChevronDown
};
