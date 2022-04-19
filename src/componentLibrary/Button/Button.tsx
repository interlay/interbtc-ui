import { StyledButton } from './Button.style';

export interface ButtonProps extends React.PropsWithChildren<any> {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void | (() => void);
}

export const Button: React.FC<ButtonProps> = ({ className, children, onClick }) => {
  return (
    <StyledButton
      onClick={onClick}
      className={className}>
      {children}
    </StyledButton>
  );
};
