import { Expandable } from '@react-types/shared';
import { forwardRef, HTMLAttributes, Key, useEffect, useState } from 'react';

import { useDOMRef } from '../utils/dom';
import { AccordionContext } from './AccordionContext';
import { useCollection } from './use-collection';

const transformKeys = (keys: Key[]): Key[] => keys.map((key) => `.$${key}`);

type Props = {
  disabledKeys?: Array<Key>;
  /** The currently expanded keys in the collection (controlled). */
  expandedKeys?: Array<Key>;
  /** The initial expanded keys in the collection (uncontrolled). */
  defaultExpandedKeys?: Array<Key>;
  /** Handler that is called when items are expanded or collapsed. */
  onExpandedChange?: (keys: Array<Key>) => any;
};

type InheritAttrs = Omit<Expandable, keyof Props>;

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof InheritAttrs & Props>;

type AccordionProps = Props & InheritAttrs & NativeAttrs;

// TODO: rewrite using react-aria accordion when it becomes more stable
// MEMO: we are only only able to target elements that have specified keys
// when trying to disable them or expand them.
const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      defaultExpandedKeys = [],
      expandedKeys: expandedKeysProp,
      onExpandedChange,
      disabledKeys: disabledKeysProp = [],
      ...props
    },
    ref
  ): JSX.Element => {
    const [expandedKeys, setExpandedKeys] = useState(new Set(transformKeys(defaultExpandedKeys)));
    const disabledKeys = new Set(transformKeys(disabledKeysProp));

    const accordionRef = useDOMRef<HTMLDivElement>(ref);
    const collection = useCollection(props, accordionRef);

    useEffect(() => {
      if (!expandedKeysProp) return;

      const isEqual = expandedKeysProp.every((value) => expandedKeys.has(value));

      if (isEqual) return;

      setExpandedKeys(new Set(transformKeys(expandedKeysProp)));
    }, [expandedKeys, expandedKeysProp]);

    const updateKeys = (key: Key) => {
      if (!expandedKeys) return;

      const newSet = new Set([...expandedKeys]);

      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }

      setExpandedKeys(newSet);
      onExpandedChange?.(Array.from(newSet));
    };

    return (
      <AccordionContext.Provider
        value={{
          expandedKeys,
          disabledKeys,
          updateKeys,
          collection
        }}
      >
        <div {...props} ref={accordionRef} />
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = 'Accordion';

export { Accordion };
export type { AccordionProps };
