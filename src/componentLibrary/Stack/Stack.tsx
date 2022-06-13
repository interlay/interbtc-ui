import { StackContainer } from './Stack.style';

interface StackProps {
  children: React.ReactNode;
  spacing?: 'x1' | 'x2';
}

const Stack = ({ children, spacing = 'x1' }: StackProps): JSX.Element => {
  return <StackContainer spacing={spacing}>{children}</StackContainer>;
};

export { Stack };
export type { StackProps };
