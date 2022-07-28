const tuple = <T extends string[]>(...args: T): string[] => args;

const ctaVariants = tuple('primary', 'secondary', 'outlined');

export type CTAVariants = typeof ctaVariants[number];

export { tuple };
