import styled from 'styled-components';

import { theme } from '../theme';
import { Severity } from '../utils/prop-types';

type LabelProps = {
  isDefault: boolean;
};

const StyledLabelWrapper = styled.div<LabelProps>`
  display: flex;
  flex-direction: ${(props) => (props.isDefault ? 'row' : 'column')};
  justify-content: ${(props) => (props.isDefault ? 'space-between' : 'center')};
  align-items: center;
  gap: ${theme.spacing.spacing2};
  margin-bottom: ${(props) => (props.isDefault ? theme.spacing.spacing4 : theme.spacing.spacing6)};
`;

const StyledLabel = styled.span<LabelProps>`
  font-size: ${(props) => (props.isDefault ? theme.text.xs : theme.text.s)};
  color: ${theme.colors.textPrimary};
  font-weight: ${(props) => (props.isDefault ? theme.fontWeight.medium : theme.fontWeight.bold)};
`;

const StyledScoreWrapper = styled.div<LabelProps>`
  display: flex;
  flex-direction: ${(props) => (props.isDefault ? 'row' : 'column')};
  align-items: center;
  gap: ${(props) => (props.isDefault ? theme.spacing.spacing1 : theme.spacing.spacing2)};
  flex-wrap: wrap;
`;

type SublabelProps = {
  severity?: Severity;
} & LabelProps;

const StyledSublabel = styled.span<SublabelProps>`
  font-weight: ${(props) => (props.isDefault ? theme.fontWeight.medium : theme.fontWeight.bold)};
  font-size: ${theme.text.xs};
  line-height: ${(props) => (props.isDefault ? theme.lineHeight.lg : theme.lineHeight.s)};
  color: ${(props) => (props.severity ? theme.alert.severity[props.severity] : theme.colors.textTertiary)};
`;

type ScoreProps = {
  severity: Severity;
} & LabelProps;

const StyledScore = styled.span<ScoreProps>`
  font-size: ${(props) => (props.isDefault ? theme.text.xs : theme.text.xl4)};
  line-height: ${(props) => (props.isDefault ? theme.lineHeight.lg : theme.lineHeight.xl)};
  color: ${(props) => theme.alert.severity[props.severity]};
  font-weight: ${(props) => (props.isDefault ? theme.fontWeight.medium : theme.fontWeight.bold)};
  // TODO: Add transition speed to theme
  transition: color 250ms;
  will-change: left;
`;

type BarProps = {
  width: number;
};

type SegmentProps = {
  severity: Severity;
};

const StyledBar = styled.div<BarProps>`
  display: flex;
  position: relative;
  height: ${theme.score.bar.height};

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
    // TODO: Add transition speed to theme
    transition: left 250ms;
    will-change: left;
    margin-top: ${theme.spacing.spacing2};
  }
`;

const StyledSegment = styled.span<SegmentProps>`
  background-color: ${(props) => theme.alert.severity[props.severity]};
  flex: 1;

  &:first-child {
    border-bottom-left-radius: ${theme.score.bar.radius};
    border-top-left-radius: ${theme.score.bar.radius};
  }

  &:last-child {
    border-bottom-right-radius: ${theme.score.bar.radius};
    border-top-right-radius: ${theme.score.bar.radius};
  }
`;

export { StyledBar, StyledLabel, StyledLabelWrapper, StyledScore, StyledScoreWrapper, StyledSegment, StyledSublabel };
