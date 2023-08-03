import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';

const getWrappedElement = (
  children: string | ReactElement | ReactNode
): ReactElement<any, JSXElementConstructor<any>> => {
  let element: ReactElement<any, JSXElementConstructor<any>>;

  if (typeof children === 'string') {
    element = <span>{children}</span>;
  } else {
    element = React.Children.only(children) as ReactElement<any, JSXElementConstructor<any>>;
  }

  return element;
};

export { getWrappedElement };
