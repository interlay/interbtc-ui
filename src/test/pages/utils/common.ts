type ElementName = string | RegExp;

const composeName = (name: ElementName): RegExp => (typeof name === 'string' ? new RegExp(name, 'i') : name);

export { composeName };
export type { ElementName };
