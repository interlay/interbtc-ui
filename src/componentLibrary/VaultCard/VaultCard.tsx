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
        {/* TODO: string transforms are temporary until we have a dictionary solution at the component level */}
        {collateral.toUpperCase()} - {wrappedAsset.toUpperCase()}
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
          <dt>Collateral score</dt>
          <dd>{collateralScore === '∞' ? collateralScore : `${collateralScore}%`}</dd>
        </DlItem>
      </StyledDl>
      <CTAWrapper>
        <CTALink
          href={link}
          variant='primary'
          fullWidth={false}>
          Manage
        </CTALink>
      </CTAWrapper>
    </CardBody>
  </Card>
);

export { VaultCard };
export type { VaultCardProps };
