import { GridItemContainer } from './GridItem.style';

type Justify = 'start' | 'center' | 'end';

type GridColumnsWide = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type GridColumnsNarrow = 1 | 2 | 3 | 4;

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  mobile: {
    span: GridColumnsNarrow;
    start?: GridColumnsNarrow;
    row?: number;
    justify?: Justify;
  };
  desktop: {
    span: GridColumnsWide;
    start?: GridColumnsWide;
    row?: number;
    justify?: Justify;
  };
}

const GridItem = ({ mobile, desktop, className, children }: GridItemProps): JSX.Element => (
  <GridItemContainer mobile={mobile} desktop={desktop} className={className}>
    {children}
  </GridItemContainer>
);

export { GridItem };
export type { GridItemProps };
