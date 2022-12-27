import { mergeProps } from '@react-aria/utils';

import { TextProps } from '../Text';
import { NormalAlignments } from '../utils/prop-types';
import { StyledModalTitle } from './Modal.style';
import { useModalContext } from './ModalContext';

type Props = {
  alignment?: NormalAlignments;
  as?: any;
};

type InheritAttrs = Omit<TextProps, keyof Props>;

type ModalTitleProps = Props & InheritAttrs;

const ModalTitle = ({ alignment = 'center', as, children, ...props }: ModalTitleProps): JSX.Element => {
  const { titleProps } = useModalContext();

  return (
    <StyledModalTitle as={as} $alignment={alignment} {...mergeProps(titleProps || {}, props)}>
      {children}
    </StyledModalTitle>
  );
};

export { ModalTitle };
export type { ModalTitleProps };
