const tuple = <T extends string[]>(...args: T): T => args;

const ctaVariants = tuple('primary', 'secondary', 'outlined');

export const status = tuple('error', 'warning', 'success');

export type CTAVariants = typeof ctaVariants[number];

export type Status = typeof status[number];

export { tuple };
