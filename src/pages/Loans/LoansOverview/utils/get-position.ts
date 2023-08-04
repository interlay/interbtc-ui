import { BorrowPosition, CollateralPosition } from '@/types/loans';

const getPosition = <T extends CollateralPosition | BorrowPosition>(positions: T[], ticker: string): T | undefined =>
  positions.find((position) => position.amount.currency.ticker === ticker);

export { getPosition };
