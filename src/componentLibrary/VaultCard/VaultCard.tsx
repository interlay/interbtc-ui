import { CollateralIdLiteral, CurrencyIdLiteral } from '@interlay/interbtc-api';
import { CoinPair, CTALink } from 'componentLibrary';
import { Card, CardHeader, CardTitle, CardBody, StyledDl, DlItem, CTAWrapper } from './VaultCard.style';

interface VaultCardProps {
  collateral: CollateralIdLiteral;
  wrappedAsset: CurrencyIdLiteral;
  pendingRequests: number;
  apy: string;
  collateralScore: string;
  link: string;
}

const VaultCard = ({
  collateral,
  wrappedAsset,
  pendingRequests,
  apy,
  collateralScore,
  link
}: VaultCardProps): JSX.Element => (
  <Card>
    <CardHeader>
      <CoinPair
        coinOne={collateral}
        coinTwo={wrappedAsset}
        size='large' />
      <CardTitle>
        {collateral} - {wrappedAsset}
      </CardTitle>
    </CardHeader>
    <CardBody>
      <StyledDl>
        <DlItem>
          {/* TODO: these headings will also be moved to the dictionary */}
          <dt>Pending requests</dt>
          <dd>{pendingRequests}</dd>
        </DlItem>
      </StyledDl>
      <StyledDl>
        <DlItem>
          <dt>Current APY</dt>
          <dd>≈{apy}%</dd>
        </DlItem>
        <DlItem>
          <dt>Collateralization</dt>
          <dd>{collateralScore === '∞' ? collateralScore : `${collateralScore}%`}</dd>
        </DlItem>
      </StyledDl>
      <CTAWrapper>
        <CTALink
          href={link}
          variant='primary'
          fullWidth={false}>
          View
        </CTALink>
      </CTAWrapper>
    </CardBody>
  </Card>
);

export { VaultCard };
export type { VaultCardProps };
