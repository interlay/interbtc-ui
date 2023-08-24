import { mergeProps } from '@react-aria/utils';
import { useState } from 'react';

import { Flex, FlexProps, InputProps, ListItem, ListProps, NumberInput } from '@/component-library';

import { StyledList } from './StakingForm.style';

const items = [
  { label: '1 Week', value: '1' },
  { label: '1 Month', value: '4' },
  { label: '3 Month', value: '13' },
  { label: '6 Month', value: '26' },
  { label: 'Max', value: 'max' }
];

type Props = { maxLockTime: number; inputProps: InputProps; onListSelectionChange?: (value: number) => void };

type InheritAttrs = Omit<FlexProps, keyof Props>;

type StakingLockTimeInputProps = Props & InheritAttrs;

const StakingLockTimeInput = ({
  maxLockTime,
  onListSelectionChange,
  inputProps,
  ...props
}: StakingLockTimeInputProps): JSX.Element | null => {
  const [listLockTime, setListLockTime] = useState<number>();

  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];

    let value: number;

    if (selectedKey === 'max') {
      value = maxLockTime;
    } else {
      value = Number(selectedKey);
    }

    onListSelectionChange?.(value);
    setListLockTime(value);
  };

  return (
    <Flex direction='column' gap='spacing4' {...props}>
      <NumberInput
        label={`Extended lock time in weeks (Max ${maxLockTime})`}
        labelPosition='side'
        justifyContent='space-between'
        maxWidth='spacing12'
        {...mergeProps(inputProps, { onChange: () => setListLockTime(undefined) })}
      />
      <StyledList
        aria-label='staking lock time'
        direction='row'
        selectionMode='single'
        onSelectionChange={handleSelectionChange}
        selectedKeys={listLockTime === undefined ? undefined : [listLockTime]}
        disabledKeys={items
          .filter((item) => (item.value === 'max' ? maxLockTime : Number(item.value)) > maxLockTime)
          .map((item) => item.value)}
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
