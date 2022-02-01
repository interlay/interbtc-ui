
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
  currentChain: ChainOption;
  onChange: (name: string) => void;
}

const ChainSelector = ({
  chainOptions,
  currentChain,
  onChange
}: Props): JSX.Element => {
  return (
    <>
      {currentChain && (
        <Select
          variant={SELECT_VARIANTS.formField}
          key={currentChain.name}
          value={currentChain.name}
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
                    {currentChain.icon}
                    <SelectText>
                      <span className='capitalize'>
                        {currentChain.name}
                      </span>
                    </SelectText>
                  </span>
                </SelectButton>
                <SelectOptions open={open}>
                  {chainOptions.map((chainOption: ChainOption) => {
                    return (
                      <SelectOption
                        key={chainOption.name}
                        value={chainOption.name}>
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
                              <SelectText>
                                <span className='capitalize'>
                                  {chainOption.name}
                                </span>
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
      )}
    </>
  );
};

export type { Props, ChainOption };
export default ChainSelector;
