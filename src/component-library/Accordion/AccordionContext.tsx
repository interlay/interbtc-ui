import React, { Key } from 'react';

interface AccordionConfig {
  disabledKeys?: Set<Key>;
  expandedKeys?: Set<Key>;
  defaultExpandedKeys?: Set<Key>;
  collection?: Map<ChildNode, React.Key>;
  updateKeys?: (key: Key) => void;
}

const defaultContext = { collection: new Map() };

const AccordionContext = React.createContext<AccordionConfig>(defaultContext);

const useAccordionContext = (): AccordionConfig => React.useContext<AccordionConfig>(AccordionContext);

export { AccordionContext, useAccordionContext };
export type { AccordionConfig };
