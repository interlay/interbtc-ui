import { useId } from '@react-aria/utils';
import { TFunction, useTranslation } from 'react-i18next';

import { CTA, H3, P, Stack, TokenInput } from '@/component-library';
import { SupplyAssetData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { StyledDItem, StyledDl } from './SupplyModal.style';

const getContentMap = (t: TFunction) => ({
  supply: {
    title: t('loans.supply')
  },
  withdraw: {
    title: t('loans.withdraw')
  }
});

type SupplyFormProps = {
  asset: SupplyAssetData;
  variant: 'supply' | 'withdraw';
};

const SupplyForm = ({ asset, variant }: SupplyFormProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const content = getContentMap(t)[variant];

  return (
    <Stack spacing='double'>
      <div>
        <H3 id={titleId}>
          {content.title} {asset.currency}
        </H3>
        <P>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</P>
      </div>
      <Stack>
        <TokenInput valueInUSD='$0.00' tokenSymbol={asset.currency} balance={100} balanceInUSD={100} />
        <StyledDl>
          <StyledDItem>
            <dt>APY</dt>
            <dd>11.84%</dd>
          </StyledDItem>
          {variant === 'supply' && (
            <StyledDItem>
              <dt>INTR Rewards?</dt>
              <dd>14.14%</dd>
            </StyledDItem>
          )}
          <StyledDItem>
            <dt>Borrow Limit</dt>
            <dd>$0.00 - $45.10</dd>
          </StyledDItem>
        </StyledDl>
        <CTA size='large'>{content.title}</CTA>
      </Stack>
    </Stack>
  );
};

export { SupplyForm };
export type { SupplyFormProps };
