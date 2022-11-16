import { borrowStatus } from './get-status';

const isLiquidationRisk = (score: number): boolean => score < borrowStatus.error;

export { isLiquidationRisk };
