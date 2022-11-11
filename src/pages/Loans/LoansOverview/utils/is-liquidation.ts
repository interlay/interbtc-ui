const isLiquidation = (score: number, liquidationScore: number): boolean => score < liquidationScore;

export { isLiquidation };
