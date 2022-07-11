import { StackContainer } from './Stack.style';

interface StackProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'half' | 'single' | 'double';
}

const Stack = ({ children, className, spacing = 'single' }: StackProps): JSX.Element => {
  return (
    <StackContainer className={className} spacing={spacing}>
      {children}
    </StackContainer>
  );
};

export { Stack };
export type { StackProps };
