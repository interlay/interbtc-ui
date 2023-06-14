import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Item, SelectProps, Span, TokenData, TokenListItem, Tooltip } from '@/component-library';

import { StyledInformationCircle, StyledSelect } from './TransactionDetails.style';

type Props = {
  label: ReactNode;
  tooltipLabel?: ReactNode;
};

type InheritAttrs = Omit<SelectProps<TokenData, 'modal'>, keyof Props | 'children'>;

type TransactionFeeSelectProps = Props & InheritAttrs;

const TransactionFeeSelect = ({ label: labelProp, tooltipLabel, ...props }: TransactionFeeSelectProps): JSX.Element => {
  const { t } = useTranslation();

  const label = tooltipLabel ? (
    <Span>
      {labelProp}
      {tooltipLabel && (
        <Tooltip label={tooltipLabel}>
          <StyledInformationCircle size='s' />
        </Tooltip>
      )}
    </Span>
  ) : (
    labelProp
  );

  return (
    <StyledSelect
      type='modal'
      size='small'
      modalTitle={t('select_token')}
      renderValue={(item) => item.value.value}
      label={label}
      {...props}
    >
      {(data: TokenData) => (
        <Item key={data.value} textValue={data.value}>
          <TokenListItem {...data} />
        </Item>
      )}
    </StyledSelect>
  );
};

export { TransactionFeeSelect };
export type { TransactionFeeSelectProps };
