import { Children, isValidElement, Key, RefObject, useEffect, useState } from 'react';

import { AccordionProps } from './Accordion';

// Maps children to respective keys.
const useCollection = (
  { children }: AccordionProps,
  ref: RefObject<HTMLDivElement>
): Map<ChildNode, Key> | undefined => {
  const [collection, setCollection] = useState<Map<ChildNode, Key>>();

  useEffect(() => {
    if (collection) return;

    const { childNodes } = ref.current || {};

    if (!childNodes) return;

    const keys = Children.toArray(children).map((child) => (isValidElement(child) ? child.key : null));

    const nodesMap = Array.from(childNodes).reduce(
      (map, node, index) => {
        const nodeKey = keys[index];
        return nodeKey ? map.set(node, nodeKey) : map;
      },

      new Map<ChildNode, Key>()
    );

    setCollection(nodesMap);
  }, [ref, children, collection]);

  return collection;
};

export { useCollection };
