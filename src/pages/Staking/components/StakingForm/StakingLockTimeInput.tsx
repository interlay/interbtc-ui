import { mergeProps } from '@react-aria/utils';
import { Key, useMemo, useState } from 'react';

import {
  Flex,
  FlexProps,
  InputProps,
  ListItem,
  ListProps,
  NumberInput,
  theme,
  useMediaQuery
} from '@/component-library';

import { StyledList } from './StakingForm.style';

type Props = {
  isExtending: boolean;
  min: number;
  max: number;
  inputProps: InputProps;
  onListSelectionChange?: (value: number) => void;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type StakingLockTimeInputProps = Props & InheritAttrs;

const StakingLockTimeInput = ({
  isExtending,
  min,
  max,
  onListSelectionChange,
  inputProps,
  ...props
}: StakingLockTimeInputProps): JSX.Element => {
  const [listLockTime, setListLockTime] = useState<Key | undefined>(inputProps.value?.toString() as Key);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];

    const value = Number(selectedKey);

    onListSelectionChange?.(value);
    setListLockTime(selectedKey);
  };

  const items = useMemo(
    () => [
      { label: '1 Week', value: '1' },
      { label: '1 Month', value: '4' },
      { label: '3 Month', value: '13' },
      { label: '6 Month', value: '26' },
      { label: 'Max', value: max.toString() }
    ],
    [max]
  );

  const isDisabled = max <= 0;

  const listKeys = items.map((item) => item.value);

  const disabledKeys = isDisabled ? listKeys : listKeys.filter((key) => (key === 'max' ? max : Number(key)) > max);

  const label = isExtending ? `Extended lock time in weeks (Max ${max})` : `Lock time in weeks (Max ${max})`;

  return (
    <Flex direction='column' gap='spacing4' {...props}>
      <NumberInput
        label={label}
        min={min}
        max={max}
        isDisabled={max <= 0}
        placeholder={isExtending ? '0' : '1'}
        maxLength={max.toString().length}
        {...mergeProps(inputProps, {
          onChange: () => setListLockTime(undefined),
          ...(!isMobile && { labelPosition: 'side', justifyContent: 'space-between', maxWidth: 'spacing12' })
        })}
      />
      <StyledList
        wrap
        aria-label='staking lock time'
        direction='row'
        selectionMode='single'
        onSelectionChange={handleSelectionChange}
        selectedKeys={listLockTime ? [listLockTime] : []}
        disabledKeys={disabledKeys}
      >
        {items.map((item) => (
          <ListItem justifyContent='center' textValue={item.value} key={item.value}>
            {item.label}
          </ListItem>
        ))}
      </StyledList>
    </Flex>
  );
};

export { StakingLockTimeInput };
export type { StakingLockTimeInputProps };
