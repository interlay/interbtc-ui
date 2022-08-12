import styled from 'styled-components';

import { theme } from '../theme';
import { Status } from '../utils/prop-types';

type LabelProps = {
  isDefault: boolean;
};

const StyledLabelWrapper = styled.div<LabelProps>`
  display: flex;
  flex-direction: ${(props) => (props.isDefault ? 'row' : 'column')};
  justify-content: ${(props) => (props.isDefault ? 'space-between' : 'center')};
  align-items: center;
  gap: ${theme.spacing.spacing2};
  margin-bottom: ${(props) => (props.isDefault ? theme.spacing.spacing8 : theme.spacing.spacing6)};
`;

const StyledLabel = styled.span<LabelProps>`
  font-size: ${(props) => (props.isDefault ? theme.text.xs : theme.text.lg)};
  line-height: ${(props) => (props.isDefault ? theme.lineHeight.s : theme.text.base)};
  color: ${(props) => (props.isDefault ? theme.colors.textTertiary : theme.colors.textPrimary)};
  font-weight: ${(props) => (props.isDefault ? theme.fontWeight.book : theme.fontWeight.bold)};
`;

const StyledScoreWrapper = styled.div<LabelProps>`
  display: flex;
  flex-direction: ${(props) => (props.isDefault ? 'row' : 'column')};
  align-items: center;
  gap: ${(props) => (props.isDefault ? theme.spacing.spacing1 : theme.spacing.spacing2)};
  flex-wrap: wrap;
`;

type SublabelProps = {
  status?: Status;
} & LabelProps;

const StyledSublabel = styled.span<SublabelProps>`
  font-weight: ${(props) => (props.isDefault ? theme.fontWeight.medium : theme.fontWeight.bold)};
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.s};
  color: ${(props) => (props.status ? theme.score.bar.status[props.status] : theme.colors.textPrimary)};
`;

type ScoreProps = {
  status: Status;
} & LabelProps;

const StyledScore = styled.span<ScoreProps>`
  font-size: ${(props) => (props.isDefault ? theme.text.xs : theme.text.xl4)};
  line-height: ${(props) => (props.isDefault ? theme.lineHeight.lg : theme.lineHeight.xl)};
  color: ${(props) => theme.score.bar.status[props.status]};
  font-weight: ${(props) => (props.isDefault ? theme.fontWeight.medium : theme.fontWeight.bold)};
  transition: color ${theme.transition.duration}ms;
  will-change: color;
`;

type BarProps = {
  width: number;
};

const StyledBar = styled.div<BarProps>`
  display: flex;
  position: relative;
  height: ${theme.score.bar.height};
  background: ${theme.score.bar.bg};
  border-radius: ${theme.score.bar.radius};

  &::before {
    content: '';
    position: absolute;
    width: 50%;
    top: -8px;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 1px dashed ${theme.score.bar.separator.color};
    border-right: 1px dashed ${theme.score.bar.separator.color};
    z-index: 1;
  }

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-left: ${theme.score.bar.indicator.border.left};
    border-right: ${theme.score.bar.indicator.border.right};
    border-bottom: ${theme.score.bar.indicator.border.bottom};
    position: absolute;
    left: ${(props) => props.width}%;
    top: 100%;
    transform: translate(-50%);
    transition: left ${theme.transition.duration}ms;
    will-change: left;
    margin-top: 16px;
  }
`;

export { StyledBar, StyledLabel, StyledLabelWrapper, StyledScore, StyledScoreWrapper, StyledSublabel };
