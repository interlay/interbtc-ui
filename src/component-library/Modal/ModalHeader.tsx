import { mergeProps } from '@react-aria/utils';
import { ElementType } from 'react';

import { TextProps } from '../Text';
import { StyledModalHeader } from './Modal.style';
import { useModalContext } from './ModalContext';

type Props = {
  elementType?: ElementType;
};

type InheritAttrs = Omit<TextProps, keyof Props>;

type ModalHeaderProps = Props & InheritAttrs;

const ModalHeader = ({
  align = 'center',
  size = 'xl',
  weight = 'semibold',
  elementType,
  children,
  ...props
}: ModalHeaderProps): JSX.Element => {
  const { titleProps } = useModalContext();

  return (
    <StyledModalHeader
      as={elementType}
      align={align}
      size={size}
      weight={weight}
      {...mergeProps(titleProps || {}, props)}
    >
      {children}
    </StyledModalHeader>
  );
};

export { ModalHeader };
export type { ModalHeaderProps };
