import { FlexProps } from '@/component-library';

import { ItemData } from './BaseInfographics';
import { StyledItem } from './BaseInfographics.styles';

type Props = Omit<ItemData, 'label'>;

type InheritAttrs = Omit<FlexProps, keyof Props>;

type BaseInfographicsItemProps = Props & InheritAttrs;

const BaseInfographicsItem = ({ icon, ...props }: BaseInfographicsItemProps): JSX.Element => {
  return (
    <StyledItem alignItems='center' direction='column' gap='spacing2' {...props}>
      {icon}
      {/* <Span size='s'>{label}</Span> */}
    </StyledItem>
  );
};

export { BaseInfographicsItem };
