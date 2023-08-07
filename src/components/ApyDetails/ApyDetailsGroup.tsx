import { ReactNode } from 'react';

import { Dd, Dl, DlGroup, DlGroupProps, Dt } from '@/component-library';

type Props = {
  title: ReactNode;
};

type InheritAttrs = Omit<DlGroupProps, keyof Props>;

type ApyDetailsGroupProps = Props & InheritAttrs;

const ApyDetailsGroup = ({
  direction = 'column',
  gap = 'spacing1',
  alignItems = 'flex-start',
  title,
  children,
  ...props
}: ApyDetailsGroupProps): JSX.Element => (
  <DlGroup direction={direction} gap={gap} alignItems={alignItems} {...props}>
    <Dt weight='bold' color='primary'>
      {title}
    </Dt>
    <Dd>
      <Dl direction='column' alignItems='flex-start' gap='spacing0'>
        {children}
      </Dl>
    </Dd>
  </DlGroup>
);

export { ApyDetailsGroup };
export type { ApyDetailsGroupProps };
