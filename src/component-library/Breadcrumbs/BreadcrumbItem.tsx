import { AriaBreadcrumbsProps, useBreadcrumbItem } from '@react-aria/breadcrumbs';
import { mergeProps } from '@react-aria/utils';
import { AnchorHTMLAttributes, Fragment, useRef } from 'react';

import { ChevronRight } from '@/assets/icons';

import { TextLinkProps } from '../TextLink';
import { StyledLinkBreadcrumb, StyledSpanBreadcrumb } from './Breadcrumbs.style';

type Props = {
  isDisabled?: boolean;
  isCurrent: boolean;
  to: TextLinkProps['to'];
};

type InheritAttrs = Omit<AriaBreadcrumbsProps, keyof Props>;

type NativeAttrs = Omit<AnchorHTMLAttributes<unknown>, keyof (Props & InheritAttrs)>;

type BreadcrumbItemProps = Props & NativeAttrs & InheritAttrs;

const BreadcrumbItem = ({ children, isDisabled, isCurrent, to, ...props }: BreadcrumbItemProps): JSX.Element => {
  const ref = useRef(null);
  const { itemProps } = useBreadcrumbItem(
    {
      ...props,
      children,
      isDisabled: isCurrent,
      elementType: isCurrent ? 'span' : 'a'
    },
    ref
  );

  const commonProps: Pick<TextLinkProps, 'size' | 'color'> = {
    size: 's',
    color: isCurrent ? 'secondary' : 'tertiary'
  };

  return (
    <Fragment>
      {isCurrent ? (
        <StyledSpanBreadcrumb ref={ref} {...mergeProps(commonProps, itemProps)}>
          {children}
        </StyledSpanBreadcrumb>
      ) : (
        <StyledLinkBreadcrumb ref={ref} to={to} $isDisabled={isDisabled} {...mergeProps(commonProps, itemProps)}>
          {children}
        </StyledLinkBreadcrumb>
      )}
      {isCurrent === false && <ChevronRight size='xs' color='tertiary' />}
    </Fragment>
  );
};

export { BreadcrumbItem };
export type { BreadcrumbItemProps };
