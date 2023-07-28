import styled from 'styled-components';

import { Flex, IconSize, Span, theme } from '@/component-library';

import { StrategyInfographicsItem } from './StrategyInfographicsItem';

type StyledGridProps = {
  $isCyclic?: boolean;
};

type StyledItemProps = {
  $gridArea: 'start-icon' | 'middle-icon' | 'end-icon';
};

type StyledRightArrowProps = {
  $gridArea: 'first-right-arrow' | 'second-right-arrow';
};

type StyledLabelProp = {
  $gridArea: 'start-label' | 'middle-label' | 'end-label' | 'cycle-label';
};

const StyledGrid = styled.div<StyledGridProps>`
  display: grid;
  grid-template-columns: 1fr min-content 1fr 1fr min-content 1fr 1fr min-content 1fr;
  grid-template-areas: ${({ $isCyclic }) => `
  '. start-icon first-right-arrow first-right-arrow middle-icon second-right-arrow second-right-arrow end-icon .'
  'start-label start-label start-label middle-label middle-label middle-label end-label end-label end-label'
  ${
    $isCyclic
      ? `'. end-arrow end-arrow end-arrow end-arrow end-arrow end-arrow end-arrow .'
  '. cycle-label cycle-label cycle-label cycle-label cycle-label cycle-label cycle-label .'`
      : ''
  }
  `};
  gap: ${theme.spacing.spacing1};
`;

const StyledInfographicsItem = styled(StrategyInfographicsItem)<StyledItemProps>`
  grid-area: ${({ $gridArea }) => $gridArea};
`;

const StyledItemContainer = styled(Flex)`
  position: relative;
`;

const StyledStack = styled(Flex)`
  > :last-child {
    margin-left: calc(${theme.icon.sizes.xl2} * -0.35);
  }
`;

const StyledRightArrow = styled.div<StyledRightArrowProps>`
  grid-area: ${({ $gridArea }) => $gridArea};

  position: relative;
  height: 1px;
  border-bottom: 1px dashed black;
  margin-top: auto;
  margin-bottom: auto;

  &::after {
    content: '';
    position: absolute;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 6px solid black;
    right: 0;
    top: calc(50% + 0.5px);
    transform: translate(25%, -50%);
  }
`;

const StyledEndArrow = styled.div`
  grid-area: end-arrow;

  position: relative;
  height: 20px;
  border-left: 1px dashed black;
  border-bottom: 1px dashed black;
  border-right: 1px dashed black;
  margin-left: calc(${theme.icon.sizes.xl2} / 2);
  margin-right: calc((${theme.icon.sizes.xl2} + (${theme.icon.sizes.xl2} / 2)) / 2);

  &::after {
    content: '';
    position: absolute;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 6px solid black;
    top: 2px;
    left: -0.5px;
    transform: translate(-50%, -50%);
  }
`;

const StyledLabel = styled(Span)<StyledLabelProp>`
  grid-area: ${({ $gridArea }) => $gridArea};
  justify-self: center;
`;

type StyledIconProps = {
  $size?: IconSize;
};

const StyledIcon = styled.span<StyledIconProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: ${theme.rounded.full};
  border: 1px solid black;
  padding: ${({ $size }) => {
    switch ($size) {
      case 's':
        return '0.15rem';
      default:
      case 'md':
        return `calc(${theme.spacing.spacing3} - 1px)`;
    }
  }};

  @media ${theme.breakpoints.down('md')} {
    padding: ${({ $size }) => ($size === 'md' ? `calc(${theme.spacing.spacing2} - 1px)` : undefined)};
  }
`;

type StyledSubIconProps = {
  $isCenterPosition: boolean;
};

const StyledSubIcon = styled.span<StyledSubIconProps>`
  position: absolute;
  bottom: 0;
  left: ${({ $isCenterPosition }) => ($isCenterPosition ? '50%' : '100%')};
  transform: ${({ $isCenterPosition }) => ($isCenterPosition ? 'translate(-50%, 10%)' : 'translate(-70%, 10%)')};
`;

export {
  StyledEndArrow,
  StyledGrid,
  StyledIcon,
  StyledInfographicsItem,
  StyledItemContainer,
  StyledLabel,
  StyledRightArrow,
  StyledStack,
  StyledSubIcon
};
