import { Children, isValidElement, Key, RefObject, useEffect, useState } from 'react';

import { AccordionProps } from './Accordion';

// We need to create a map that will help each `AcordionItem`
// identify themselfs. To do so, we need to access each element
// element from `children`, check if the element is valid and finally
// access exposed key.
// When the keys are gathered, they are used as keys for our `Map`, where
// the values will be the component to whom that key belongs.
const useCollection = (
  { children }: AccordionProps,
  ref: RefObject<HTMLDivElement>
): Map<ChildNode, Key> | undefined => {
  const [collection, setCollection] = useState<Map<ChildNode, Key>>();

  useEffect(() => {
    if (!ref.current?.childNodes) return;

    // Gathering Keys
    const keys = Children.toArray(children).map((child) => (isValidElement(child) ? child.key : null));

    // Mapping keys to components
    const nodesMap = Array.from(ref.current.childNodes).reduce((map, node, index) => {
      const nodeKey = keys[index];
      return nodeKey ? map.set(node, nodeKey) : map;
    }, new Map<ChildNode, Key>());

    setCollection(nodesMap);
  }, [ref, children]);

  return collection;
};

export { useCollection };
