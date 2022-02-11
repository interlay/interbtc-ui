
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

interface AccountOption {
  name: string;
  icon: JSX.Element;
}

interface Props {
  chainOptions: Array<AccountOption>;
  selectedChain: AccountOption;
  onChange: (chain: AccountOption) => void;
}

const AccountSelector = ({
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
        <SelectBody>
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
              <SelectText className='capitalize'>
                {selectedChain.name}
              </SelectText>
            </span>
          </SelectButton>
          <SelectOptions open={open}>
            {chainOptions.map((chainOption: AccountOption) => {
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

export type { AccountOption };
export default AccountSelector;
