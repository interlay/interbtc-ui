import { ReactNode } from 'react';

import { TextProps } from '../types';
import { Dd, DefinitionList, Dt, ListItem } from './Dl.style';

type DlItem = {
  term: string;
  definition: ReactNode;
  render?: (children: ReactNode) => ReactNode;
};

interface DlProps extends TextProps<HTMLDListElement> {
  listItems: Array<DlItem>;
}

const Dl = ({ listItems, ...props }: DlProps): JSX.Element => {
  return (
    <DefinitionList {...props}>
      {listItems.map((listItem) => {
        const content = (
          <>
            <Dt>{listItem.term}:</Dt>
            <Dd>{listItem.definition}</Dd>
          </>
        );

        return <ListItem key={listItem.term}>{listItem.render?.(content) || content}</ListItem>;
      })}
    </DefinitionList>
  );
};

Dl.displayName = 'P';

export { Dl };
export type { DlProps };
