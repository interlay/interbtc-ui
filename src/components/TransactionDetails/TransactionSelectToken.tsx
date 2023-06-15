import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Item, SelectProps, Span, TokenData, TokenListItem, Tooltip } from '@/component-library';

import { StyledInformationCircle, StyledSelect } from './TransactionDetails.style';

type Props = {
  label?: ReactNode;
  tooltipLabel?: ReactNode;
};

type InheritAttrs = Omit<SelectProps<'modal', TokenData>, keyof Props | 'children'>;

type TransactionSelectTokenProps = Props & InheritAttrs;

const TransactionSelectToken = ({
  label: labelProp,
  tooltipLabel,
  ...props
}: TransactionSelectTokenProps): JSX.Element => {
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

export { TransactionSelectToken };
export type { TransactionSelectTokenProps };
