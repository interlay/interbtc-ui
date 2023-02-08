import { RedeemStatus } from '@interlay/interbtc-api';

// Bare minimum for now
interface RedeemRequest {
  id: string;
}

interface RedeemRequestWithStatusDecoded extends RedeemRequest {
  status: RedeemStatus;
}

export type { RedeemRequest, RedeemRequestWithStatusDecoded };
