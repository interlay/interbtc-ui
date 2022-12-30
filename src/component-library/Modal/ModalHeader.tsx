import { mergeProps } from '@react-aria/utils';
import { ElementType } from 'react';

import { TextProps } from '../Text';
import { NormalAlignments } from '../utils/prop-types';
import { StyledModalHeader } from './Modal.style';
import { useModalContext } from './ModalContext';

type Props = {
  alignment?: NormalAlignments;
  elementType?: ElementType;
};

type InheritAttrs = Omit<TextProps, keyof Props>;

type ModalHeaderProps = Props & InheritAttrs;

const ModalHeader = ({ alignment = 'center', elementType, children, ...props }: ModalHeaderProps): JSX.Element => {
  const { titleProps } = useModalContext();

  return (
    <StyledModalHeader as={elementType} $alignment={alignment} {...mergeProps(titleProps || {}, props)}>
      {children}
    </StyledModalHeader>
  );
};

export { ModalHeader };
export type { ModalHeaderProps };
