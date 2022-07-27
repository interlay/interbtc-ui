import { BaseTextProps } from '../types';
import { Dd, DefinitionList, Dt, ListItem } from './Dl.style';

type DlItem = {
  term: string;
  definition: string;
};

interface DlProps extends BaseTextProps {
  listItems: Array<DlItem>;
}

const Dl = ({ listItems }: DlProps): JSX.Element => {
  return (
    <DefinitionList>
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
