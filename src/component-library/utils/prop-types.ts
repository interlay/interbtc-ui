const tuple = <T extends string[]>(...args: T): T => args;

const ctaVariants = tuple('primary', 'secondary', 'outlined');

const severity = tuple('error', 'warning', 'success');

export type CTAVariants = typeof ctaVariants[number];

export type Severity = typeof severity[number];

export { tuple };
