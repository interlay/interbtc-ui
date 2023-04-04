import { ReactNode } from 'react';

import { Flex, FlexProps, H2 } from '@/component-library';

type Props = {
  title?: ReactNode;
  titleId?: string;
  actions?: ReactNode;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type TableWrapperProps = Props & InheritAttrs;

const TableWrapper = ({ title, titleId, actions, children, ...props }: TableWrapperProps): JSX.Element => {
  return (
    <Flex {...props} direction='column' gap='spacing6' alignItems='stretch'>
      <Flex gap='spacing2' alignItems='center' justifyContent={title ? 'space-between' : 'flex-end'}>
        {title && (
          <H2 size='xl' weight='bold' id={titleId}>
            {title}
          </H2>
        )}
        {actions}
      </Flex>
      {children}
    </Flex>
  );
};

export { TableWrapper };
export type { TableWrapperProps };
