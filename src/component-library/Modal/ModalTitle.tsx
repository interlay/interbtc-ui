import { mergeProps } from '@react-aria/utils';
import { HTMLAttributes } from 'react';

import { NormalAlignments, Variants } from '../utils/prop-types';
import { StyledHr, StyledModalTitle } from './Modal.style';
import { useModalContext } from './ModalContext';

type Props = {
  variant?: Exclude<Variants, 'outlined' | 'text'>;
  alignment?: NormalAlignments;
  as?: any;
};

type InheritAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type ModalTitleProps = Props & InheritAttrs;

const ModalTitle = ({
  variant = 'primary',
  alignment = 'center',
  as,
  children,
  ...props
}: ModalTitleProps): JSX.Element => {
  const { titleProps } = useModalContext();

  return (
    <>
      <StyledModalTitle as={as} $variant={variant} $alignment={alignment} {...mergeProps(titleProps || {}, props)}>
        {children}
      </StyledModalTitle>
      {variant === 'secondary' && <StyledHr />}
    </>
  );
};

export { ModalTitle };
export type { ModalTitleProps };
