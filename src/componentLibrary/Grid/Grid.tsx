import { GridContainer } from './Grid.style';

const Grid = ({ className, children }: React.HTMLAttributes<HTMLDivElement>): JSX.Element => (
  <GridContainer className={className}>{children}</GridContainer>
);

export { Grid };
