import { useId } from '@react-aria/utils';
import { ReactNode } from 'react';

import { theme } from '@/component-library';
import { useMediaQuery } from '@/component-library/use-media-query';

import { List } from './List';
import { Table, TableProps } from './Table';

type Props = {
  title?: ReactNode;
  className?: string;
  actions?: ReactNode;
  placeholder?: ReactNode;
  responsive?: boolean;
};

type InheritAttrs = Omit<Pick<TableProps, 'rows' | 'columns'>, keyof Props>;

type DataGridProps = Props & InheritAttrs;

const DataGrid = ({ responsive = true, ...props }: DataGridProps): JSX.Element => {
  const titleId = useId();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile && responsive) {
    return <List titleId={titleId} {...props} />;
  }

  return <Table titleId={titleId} {...props} />;
};

export { DataGrid };
export type { DataGridProps };
