import styled from 'styled-components';

import { theme } from '../theme';

type LabelWrapperProps = {
  isRow: boolean;
};

const StyledLabelWrapper = styled.div<LabelWrapperProps>`
  display: flex;
  flex-direction: ${(props) => (props.isRow ? 'row' : 'column')};
  align-items: center;
  gap: 8px;
`;

const StyledLabel = styled.span`
  font-size: ${theme.text.s};
  color: ${theme.colors.textPrimary};
  font-weight: bold;
`;

type ScoreWrapperProps = {
  isRow: boolean;
};

const StyledScoreWrapper = styled.div<ScoreWrapperProps>`
  display: flex;
  flex-direction: ${(props) => (props.isRow ? 'row' : 'column')};
  align-items: center;
  gap: 8px;
`;

type SublabelProps = {
  severity?: 'error' | 'warning' | 'success';
};

const StyledSublabel = styled.span<SublabelProps>`
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => (props.severity ? theme.alert.severity[props.severity] : theme.colors.textTertiary)};
`;

type ScoreProps = {
  severity: 'error' | 'warning' | 'success';
};

const StyledScore = styled.span<ScoreProps>`
  font-size: 36px;
  line-height: 40px;
  color: ${(props) => theme.alert.severity[props.severity]};
  font-weight: bold;
  transition: color 250ms;
  will-change: left;
`;

type BarProps = {
  score: number;
};

type SegmentProps = {
  severity: 'error' | 'warning' | 'success';
};

const StyledBar = styled.div<BarProps>`
  display: flex;
  position: relative;
  height: 10px;
  margin-top: 26px;

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    margin-top: 8px;
    left: ${(props) => props.score}%;
    transform: translate(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 18px solid white;
    transition: left 250ms;
    will-change: left;
  }
`;

const StyledSegment = styled.span<SegmentProps>`
  background-color: ${(props) => theme.alert.severity[props.severity]};
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
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
