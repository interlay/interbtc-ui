import styled from 'styled-components';
import { theme } from 'componentLibrary/theme';

export interface Props extends React.PropsWithChildren<any> {
  variant: 'primary' | 'secondary' | 'success';
  position: 'left' | 'right';
  size: 'small' | 'large';
  disabled: boolean;
}

export const StyledButton = styled.button<Props>({
  backgroundColor: theme.colors.primary
});
