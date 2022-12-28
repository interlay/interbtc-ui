import styled from 'styled-components';

type StyledAccordionItemWrapperProps = {
  $isOpen: boolean;
  $isDisabled: boolean;
};

type StyledAccordionItemButtonProps = {
  $isHovered: boolean;
};

const StyledAccordionItemWrapper = styled.div<StyledAccordionItemWrapperProps>``;

const StyledAccordionItemHeading = styled.h3``;

const StyledAccordionItemButton = styled.button<StyledAccordionItemButtonProps>``;

export { StyledAccordionItemButton, StyledAccordionItemHeading, StyledAccordionItemWrapper };
