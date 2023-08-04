import { AriaBreadcrumbsProps, useBreadcrumbs } from '@react-aria/breadcrumbs';
import { Children, forwardRef, HTMLAttributes, isValidElement, ReactElement } from 'react';

import { useDOMRef } from '../utils/dom';
import { BreadcrumbItem } from './BreadcrumbItem';
import { StyledList, StyledListItem, StyledNav } from './Breadcrumbs.style';

type Props = {
  onAction?: (key: React.Key) => void;
  isDisabled?: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaBreadcrumbsProps, keyof Props>;

type BreadcrumbsProps = Props & NativeAttrs & InheritAttrs;

const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ children, isDisabled, ...props }, ref): JSX.Element => {
    const domRef = useDOMRef(ref);

    const { navProps } = useBreadcrumbs(props);

    const childArray: ReactElement[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        childArray.push(child);
      }
    });

    const lastIndex = childArray.length - 1;

    const breadcrumbItems = childArray.map((child, index) => {
      const isCurrent = index === lastIndex;

      return (
        <StyledListItem key={index}>
          <BreadcrumbItem {...child.props} isCurrent={isCurrent} isDisabled={isDisabled} />
        </StyledListItem>
      );
    });

    return (
      <StyledNav {...navProps} ref={domRef}>
        <StyledList>{breadcrumbItems}</StyledList>
      </StyledNav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';

export { Breadcrumbs };
export type { BreadcrumbsProps };
