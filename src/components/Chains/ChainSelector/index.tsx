
import clsx from 'clsx';

import Select, {
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText,
  SELECT_VARIANTS
} from 'components/Select';

interface ChainOption {
  name: string;
  icon: JSX.Element;
}

interface Props {
  chainOptions: Array<ChainOption>;
  selectedChain: ChainOption;
  onChange: (chain: ChainOption) => void;
}

const ChainSelector = ({
  chainOptions,
  selectedChain,
  onChange
}: Props): JSX.Element => (
  <Select
    variant={SELECT_VARIANTS.formField}
    key={selectedChain.name}
    value={selectedChain}
    onChange={onChange}>
    {({ open }) => (
      <>
        <SelectBody
          className={clsx(
            'w-full'
          )}>
          <SelectButton variant={SELECT_VARIANTS.formField}>
            <span
              className={clsx(
                'flex',
                'items-center',
                'space-x-3',
                'text-xl',
                'py-2'
              )}>
              {selectedChain.icon}
              <SelectText>
                <span className='capitalize'>
                  {selectedChain.name}
                </span>
              </SelectText>
            </span>
          </SelectButton>
          <SelectOptions open={open}>
            {chainOptions.map((chainOption: ChainOption) => {
              return (
                <SelectOption
                  key={chainOption.name}
                  value={chainOption}>
                  {({
                    selected,
                    active
                  }) => (
                    <>
                      <div
                        className={clsx(
                          'flex',
                          'items-center',
                          'space-x-3',
                          'text-xl'
                        )}>
                        {chainOption.icon}
                        <SelectText className='capitalize'>
                          {chainOption.name}
                        </SelectText>
                      </div>
                      {selected ? (
                        <SelectCheck
                          active={active} />
                      ) : null}
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
