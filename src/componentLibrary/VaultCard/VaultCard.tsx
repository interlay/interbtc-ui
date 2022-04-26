import { CoinPair, CTA } from 'componentLibrary';
import { Coins } from 'componentLibrary/types';
import { Card, CardHeader, CardTitle, CardBody, StyledDl, DlItem, CTAWrapper } from './VaultCard.style';

interface VaultCardProps {
  collateral: Coins;
  wrappedAsset: Coins;
  pendingRequests: number;
  apy: number;
  collateralScore: number;
}

const VaultCard = ({
  collateral,
  wrappedAsset,
  pendingRequests,
  apy,
  collateralScore
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
          <dd>{apy}%</dd>
        </DlItem>
        <DlItem>
          <dt>Collateral score</dt>
          <dd>{collateralScore}%</dd>
        </DlItem>
      </StyledDl>
      <CTAWrapper>
        <CTA
          variant='primary'
          fullWidth={false}>
          Manage
        </CTA>
      </CTAWrapper>
    </CardBody>
  </Card>
);

export { VaultCard };
export type { VaultCardProps };
