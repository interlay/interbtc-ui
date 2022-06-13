import { StackContainer } from './Stack.style';

interface StackProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'x1' | 'x2';
}

const Stack = ({ children, className, spacing = 'x1' }: StackProps): JSX.Element => {
  return (
    <StackContainer className={className} spacing={spacing}>
      {children}
    </StackContainer>
  );
};

export { Stack };
export type { StackProps };
