import { useTableRowGroup } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { HTMLAttributes } from 'react';

import { ElementTypeProp } from '../utils/prop-types';

type NativeAttrs = HTMLAttributes<HTMLTableSectionElement>;

type TableRowGroupProps = NativeAttrs & ElementTypeProp;

const TableRowGroup = ({ elementType: Component = 'thead', children, ...props }: TableRowGroupProps): JSX.Element => {
  const { rowGroupProps } = useTableRowGroup();

  return <Component {...mergeProps(props, rowGroupProps)}>{children}</Component>;
};

export { TableRowGroup };
export type { TableRowGroupProps };
