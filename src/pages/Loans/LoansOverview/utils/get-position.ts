import { BorrowPosition, CollateralPosition } from '@interlay/interbtc-api';

const getPosition = <T extends CollateralPosition | BorrowPosition>(positions: T[], ticker: string): T | undefined =>
  positions.find((position) => position.amount.currency.ticker === ticker);

export { getPosition };
