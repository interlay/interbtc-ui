import { AriaBreadcrumbItemProps, useBreadcrumbItem } from '@react-aria/breadcrumbs';
import { cloneElement, Fragment, HTMLAttributes, useRef } from 'react';

import { ChevronRight } from '@/assets/icons';

import { getWrappedElement } from '../utils/getWrappedElement';
import { StyledBreadcrumb } from './Breadcrumbs.style';

type Props = {
  onAction?: (key: React.Key) => void;
  isDisabled?: boolean;
  autoFocusCurrent?: boolean;
  isCurrent: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaBreadcrumbItemProps, keyof Props>;

type BreadcrumbItemProps = Props & NativeAttrs & InheritAttrs;

const BreadcrumbItem = ({ children, isDisabled, isCurrent, ...props }: BreadcrumbItemProps): JSX.Element => {
  const ref = useRef(null);
  const { itemProps } = useBreadcrumbItem(
    {
      ...props,
      children,
      elementType: typeof children === 'string' ? 'span' : 'a'
    },
    ref
  );

  const element = cloneElement(getWrappedElement(children), {
    ...itemProps,
    ref
  });

  return (
    <Fragment>
      <StyledBreadcrumb size='s' color={isCurrent ? 'secondary' : 'tertiary'} $isDisabled={isDisabled}>
        {element}
      </StyledBreadcrumb>
      {isCurrent === false && <ChevronRight size='xs' color='tertiary' />}
    </Fragment>
  );
};

export { BreadcrumbItem };
export type { BreadcrumbItemProps };
