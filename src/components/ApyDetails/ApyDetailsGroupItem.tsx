import { ReactNode } from 'react';

import { Dd, DlGroup, DlGroupProps, Dt } from '@/component-library';

type Props = {
  label: ReactNode;
  value: ReactNode;
};

type InheritAttrs = Omit<DlGroupProps, keyof Props | 'children'>;

type ApyDetailsGroupItemProps = Props & InheritAttrs;

const ApyDetailsGroupItem = ({
  gap = 'spacing1',
  wrap = 'wrap',
  label,
  value,
  ...props
}: ApyDetailsGroupItemProps): JSX.Element => (
  <DlGroup wrap={wrap} gap={gap} {...props}>
    <Dd weight='medium' color='tertiary'>
      {label}:
    </Dd>
    <Dt weight='medium' color='primary'>
      {value}
    </Dt>
  </DlGroup>
);

export { ApyDetailsGroupItem };
export type { ApyDetailsGroupItemProps };
