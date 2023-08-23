import { mergeProps } from '@react-aria/utils';
import { useState } from 'react';

import { Flex, FlexProps, Input, InputProps, List, ListItem, ListProps } from '@/component-library';

type Props = { inputProps: InputProps; onListSelectionChange?: (value: number) => void };

type InheritAttrs = Omit<FlexProps, keyof Props>;

type StakingLockTimeInputProps = Props & InheritAttrs;

const StakingLockTimeInput = ({
  onListSelectionChange,
  inputProps,
  ...props
}: StakingLockTimeInputProps): JSX.Element | null => {
  const [listLockTime, setListLockTime] = useState<number>();

  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    const [selectedKey] = [...key];

    const value = Number(selectedKey);
    onListSelectionChange?.(value);
    setListLockTime(value);
  };

  return (
    <Flex direction='column' gap='spacing4' {...props}>
      <Input
        label='Extended lock time in weeks (Max X)'
        labelPosition='side'
        justifyContent='space-between'
        maxWidth='spacing12'
        {...mergeProps(inputProps, { onChange: () => setListLockTime(undefined) })}
      />
      <List
        aria-label='staking lock time'
        direction='row'
        selectionMode='single'
        onSelectionChange={handleSelectionChange}
        selectedKeys={listLockTime === undefined ? undefined : [listLockTime]}
      >
        <ListItem textValue='1' key='1'>
          1 Week
        </ListItem>
        <ListItem textValue='4' key='4'>
          1 Month
        </ListItem>
        <ListItem textValue='13' key='13'>
          3 Month
        </ListItem>
        <ListItem textValue='26' key='26'>
          6 Month
        </ListItem>
        <ListItem textValue='max' key='max'>
          Max
        </ListItem>
      </List>
    </Flex>
  );
};

export { StakingLockTimeInput };
export type { StakingLockTimeInputProps };
