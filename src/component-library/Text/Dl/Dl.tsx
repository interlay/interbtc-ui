import { TextProps } from '../types';
import { Dd, DefinitionList, Dt, ListItem } from './Dl.style';

type DlItem = {
  term: string;
  definition: string;
};

interface DlProps extends TextProps<HTMLDListElement> {
  listItems: Array<DlItem>;
}

const Dl = ({ listItems, ...props }: DlProps): JSX.Element => {
  return (
    <DefinitionList {...props}>
      {listItems.map((listItem) => (
        <ListItem key={listItem.term}>
          <Dt>{listItem.term}:</Dt>
          <Dd>{listItem.definition}</Dd>
        </ListItem>
      ))}
    </DefinitionList>
  );
};

Dl.displayName = 'P';

export { Dl };
export type { DlProps };
