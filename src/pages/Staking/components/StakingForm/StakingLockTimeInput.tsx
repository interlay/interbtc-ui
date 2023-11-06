import { mergeProps } from '@react-aria/utils';
import { Key, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
      { label: t('staking_page.time.one_week'), value: '1' },
      { label: t('staking_page.time.one_month'), value: '4' },
      { label: t('staking_page.time.three_month'), value: '13' },
      { label: t('staking_page.time.six_month'), value: '26' },
      { label: t('max'), value: max.toString() }
    ],
    [max, t]
  );

  const isDisabled = max <= 0;

  const listKeys = useMemo(() => items.map((item) => item.value), [items]);

  const disabledKeys = isDisabled ? listKeys : listKeys.filter((key) => (key === 'max' ? max : Number(key)) > max);

  const label = isExtending
    ? t('staking_page.extended_lock_time_in_weeks', { value: max })
    : t('staking_page.lock_time_in_weeks', { value: max });

  return (
    <Flex direction='column' gap='spacing4' {...props}>
      <NumberInput
        label={label}
        min={min}
        max={max}
        isDisabled={isDisabled}
        placeholder={isExtending ? '0' : '1'}
        maxLength={max.toString().length}
        {...mergeProps(inputProps, {
          onChange: () => setListLockTime(undefined),
          ...(!isMobile && { labelPosition: 'side', justifyContent: 'space-between', maxWidth: 'spacing12' })
        })}
      />
      <StyledList
        wrap
        aria-label={label.toLowerCase()}
        direction='row'
        selectionMode='multiple'
        selectionBehavior='replace'
        onSelectionChange={handleSelectionChange}
        selectedKeys={listLockTime ? [listLockTime] : []}
        disabledKeys={disabledKeys}
      >
        {items.map((item) => (
          <ListItem justifyContent='center' textValue={item.label} aria-label={item.label} key={item.value}>
            {item.label}
          </ListItem>
        ))}
      </StyledList>
    </Flex>
  );
};

export { StakingLockTimeInput };
export type { StakingLockTimeInputProps };
