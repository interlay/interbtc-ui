import styled from 'styled-components';

import { theme } from '@/component-library';
import { Status } from '@/component-library/utils/prop-types';

const StyledWrapper = styled.div`
  width: 100%;
`;

type LabelProps = {
  isDefault: boolean;
};

const StyledLabelWrapper = styled.div<LabelProps>`
  display: flex;
  flex-direction: ${(props) => (props.isDefault ? 'row' : 'column')};
  justify-content: ${(props) => (props.isDefault ? 'space-between' : 'center')};
  align-items: center;
  gap: ${theme.spacing.spacing2};
  margin-bottom: ${(props) => (props.isDefault ? theme.spacing.spacing6 : theme.spacing.spacing4)};
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
  color: ${(props) => (props.status ? theme.meter.bar.status[props.status] : theme.colors.textPrimary)};
`;

type ScoreProps = {
  status: Status;
} & LabelProps;

const StyledScore = styled.span<ScoreProps>`
  font-size: ${(props) => (props.isDefault ? theme.text.xs : theme.text.xl4)};
  line-height: ${(props) => (props.isDefault ? theme.lineHeight.lg : theme.lineHeight.xl)};
  color: ${(props) => theme.meter.bar.status[props.status]};
  font-weight: ${(props) => (props.isDefault ? theme.fontWeight.medium : theme.fontWeight.bold)};
  transition: color ${theme.transition.duration}ms;
  will-change: color;
`;

export { StyledLabel, StyledLabelWrapper, StyledScore, StyledScoreWrapper, StyledSublabel, StyledWrapper };
