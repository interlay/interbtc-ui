import { mergeProps } from '@react-aria/utils';
import { ElementType } from 'react';

import { TextProps } from '../Text';
import { FontSize, Sizes } from '../utils/prop-types';
import { StyledDialogHeader } from './Dialog.style';
import { useDialogContext } from './DialogContext';

const sizeMap: Record<Sizes, FontSize> = {
  small: 'base',
  medium: 'xl',
  large: 'xl'
};

type Props = {
  elementType?: ElementType;
};

type InheritAttrs = Omit<TextProps, keyof Props>;

type DialogHeaderProps = Props & InheritAttrs;

const DialogHeader = ({ elementType, children, ...props }: DialogHeaderProps): JSX.Element => {
  const { titleProps, size } = useDialogContext();

  return (
    <StyledDialogHeader as={elementType} $size={size} size={sizeMap[size]} {...mergeProps(titleProps || {}, props)}>
      {children}
    </StyledDialogHeader>
  );
};

export { DialogHeader };
export type { DialogHeaderProps };
