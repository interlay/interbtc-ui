import { GridContainer } from './Grid.style';

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

const Grid = ({ className, children }: GridProps): JSX.Element => (
  <GridContainer className={className}>{children}</GridContainer>
);

export { Grid };
export type { GridProps };
