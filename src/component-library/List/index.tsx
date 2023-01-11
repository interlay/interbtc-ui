import { Item } from '@react-stately/collections';
import { ItemProps } from '@react-types/shared';

import { ListItemProps } from './ListItem';

const ListItem = Item as <T>(props: ItemProps<T> & ListItemProps) => JSX.Element;

export type { ListProps } from './List';
export { List } from './List';

export type { ListItemProps };
export { ListItem };
