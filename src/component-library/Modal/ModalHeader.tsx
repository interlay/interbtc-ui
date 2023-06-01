import { DialogHeader, DialogHeaderProps } from '../Dialog';

type ModalHeaderProps = DialogHeaderProps;

const ModalHeader = ({ align = 'center', children, ...props }: ModalHeaderProps): JSX.Element => (
  <DialogHeader align={align} {...props}>
    {children}
  </DialogHeader>
);

export { ModalHeader };
export type { ModalHeaderProps };
