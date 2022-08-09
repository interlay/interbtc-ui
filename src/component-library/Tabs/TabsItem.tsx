import { Item } from '@react-stately/collections';
import { ItemProps } from '@react-types/shared';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

type InheritAttrs = Omit<ItemProps<unknown>, keyof Props>;

type TabsItemProps = Props & InheritAttrs;

const TabsItem = ({ children, ...props }: TabsItemProps): JSX.Element => (
  <Item {...props}>{children || <span>ss</span>}</Item>
);

TabsItem['displayName'] = 'Item';

export { TabsItem };
export type { TabsItemProps };
