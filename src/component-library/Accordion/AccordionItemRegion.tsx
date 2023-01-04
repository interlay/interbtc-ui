import { HTMLAttributes, useEffect, useRef, useState } from 'react';

import { StyledAccordionItemContent, StyledAccordionItemRegion } from './Accordion.style';

type Props = {
  isExpanded: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type AccordionItemRegionProps = Props & NativeAttrs;

const AccordionItemRegion = ({ isExpanded, children, ...props }: AccordionItemRegionProps): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

  // Updates height in case anything changed in children
  useEffect(() => {
    setHeight(ref.current?.clientHeight || 0);
  }, [isExpanded]);

  return (
    <StyledAccordionItemRegion {...props} $height={height} $isExpanded={isExpanded}>
      <StyledAccordionItemContent ref={ref}>{children}</StyledAccordionItemContent>
    </StyledAccordionItemRegion>
  );
};

export { AccordionItemRegion };
export type { AccordionItemRegionProps };
