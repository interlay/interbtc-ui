const tuple = <T extends string[]>(...args: T): T => args;

const ctaVariants = tuple('primary', 'secondary', 'outlined');

const status = tuple('error', 'warning', 'success');

const sizes = tuple('small', 'medium');

export const colors = tuple('primary', 'secondary', 'tertiary');

export type CTAVariants = typeof ctaVariants[number];

export type Status = typeof status[number];

export type Sizes = typeof sizes[number];

export type Colors = typeof colors[number];

export { ctaVariants, sizes, status };

export { tuple };
