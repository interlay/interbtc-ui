import { borrowStatus } from './get-status';

const isLiquidation = (score: number): boolean => score < borrowStatus.error;

export { isLiquidation };
