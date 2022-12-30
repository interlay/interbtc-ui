import { mergeProps } from '@react-aria/utils';

import { TextProps } from '../Text';
import { ElementTypeProp, NormalAlignments } from '../utils/prop-types';
import { StyledModalTitle } from './Modal.style';
import { useModalContext } from './ModalContext';

type Props = {
  alignment?: NormalAlignments;
};

type InheritAttrs = Omit<TextProps, keyof Props>;

type ModalTitleProps = Props & InheritAttrs & ElementTypeProp;

const ModalTitle = ({ alignment = 'center', elementType, children, ...props }: ModalTitleProps): JSX.Element => {
  const { titleProps } = useModalContext();

  return (
    <StyledModalTitle as={elementType} $alignment={alignment} {...mergeProps(titleProps || {}, props)}>
      {children}
    </StyledModalTitle>
  );
};

export { ModalTitle };
export type { ModalTitleProps };
