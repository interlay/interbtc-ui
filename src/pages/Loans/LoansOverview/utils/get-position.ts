import { BorrowPosition, LendPosition } from '@interlay/interbtc-api';

const getPosition = <T extends LendPosition | BorrowPosition>(positions: T[], ticker: string): T | undefined =>
  positions.find((position) => position.currency.ticker === ticker);

export { getPosition };
