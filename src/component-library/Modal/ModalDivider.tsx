import { DividerProps } from '../Divider';
import { StyledModalDivider } from './Modal.style';

type ModalDividerProps = Omit<DividerProps, 'orientation'>;

const ModalDivider = (props: ModalDividerProps): JSX.Element => (
  <StyledModalDivider orientation='horizontal' {...props} />
);

export { ModalDivider };
export type { ModalDividerProps };
