import { useTableRowGroup } from '@react-aria/table';

const TableRowGroup = ({ type: Element, style, children }: any): JSX.Element => {
  const { rowGroupProps } = useTableRowGroup();
  return (
    <Element {...rowGroupProps} style={style}>
      {children}
    </Element>
  );
};

export { TableRowGroup };
