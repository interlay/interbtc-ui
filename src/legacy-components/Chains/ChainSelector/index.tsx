import clsx from 'clsx';

import Select, {
  SELECT_VARIANTS,
  SelectBody,
  SelectButton,
  SelectCheck,
  SelectLabel,
  SelectOption,
  SelectOptions,
  SelectText
} from '@/legacy-components/Select';
import { XCMChains } from '@/types/chains.types';

interface ChainOption {
  type: XCMChains;
  name: string;
  icon: JSX.Element;
}

interface Props {
  chainOptions: Array<ChainOption>;
  selectedChain: ChainOption | undefined;
  label: string;
  onChange?: (chain: ChainOption) => void;
}

const ChainSelector = ({ chainOptions, selectedChain, label, onChange }: Props): JSX.Element => (
  <Select variant={SELECT_VARIANTS.formField} key={selectedChain?.name} value={selectedChain} onChange={onChange}>
    {({ open }) => (
      <>
        <SelectLabel>{label}</SelectLabel>
        <SelectBody>
          <SelectButton variant={SELECT_VARIANTS.formField}>
            <span className={clsx('flex', 'items-center', 'space-x-3', 'text-xl', 'py-2')}>
              {selectedChain?.icon}
              <SelectText className='capitalize'>{selectedChain?.name}</SelectText>
            </span>
          </SelectButton>
          <SelectOptions open={open}>
            {chainOptions.map((chainOption: ChainOption) => {
              return (
                <SelectOption key={chainOption.name} value={chainOption}>
                  {({ selected, active }) => (
                    <>
                      <div className={clsx('flex', 'items-center', 'space-x-3', 'text-xl')}>
                        {chainOption.icon}
                        <SelectText className='capitalize'>{chainOption.name}</SelectText>
                      </div>
                      {selected ? <SelectCheck active={active} /> : null}
                    </>
                  )}
                </SelectOption>
              );
            })}
          </SelectOptions>
        </SelectBody>
      </>
    )}
  </Select>
);

export type { ChainOption };
export default ChainSelector;
