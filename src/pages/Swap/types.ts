import { Trade as TradeLib } from '@interlay/interbtc-api';

export type Trade = { data: TradeLib | null | undefined; isLoading: boolean };
