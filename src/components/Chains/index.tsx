import ChainSelector, { ChainOption } from './ChainSelector';

interface Props {
  label: string;
  chainOptions: Array<ChainOption> | undefined;
  onChange?: (chain: ChainOption) => void;
  selectedChain: ChainOption | undefined;
}

const Chains = ({ onChange, chainOptions, label, selectedChain }: Props): JSX.Element | null => {
  if (!selectedChain || !chainOptions) {
    return null;
  }

  return (
    <div>
      <ChainSelector label={label} chainOptions={chainOptions} selectedChain={selectedChain} onChange={onChange} />
    </div>
  );
};

export type { ChainOption };

export default Chains;
