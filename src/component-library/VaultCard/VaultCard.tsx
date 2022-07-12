import { Tokens } from '../types';
import { CoinPair, CTALink } from '..';
import { Card, CardHeader, CardTitle, CardBody, StyledDl, DlItem, CTAWrapper } from './VaultCard.style';

interface VaultCardProps {
  collateralSymbol: Tokens;
  wrappedSymbol: Tokens;
  pendingRequests: number;
  apy: string;
  collateralScore: string;
  link: string;
}

const VaultCard = ({
  collateralSymbol,
  wrappedSymbol,
  pendingRequests,
  apy,
  collateralScore,
  link
}: VaultCardProps): JSX.Element => (
  <Card>
    <CardHeader>
      <CoinPair coinOne={collateralSymbol} coinTwo={wrappedSymbol} size='large' />
      <CardTitle>
        {collateralSymbol} - {wrappedSymbol}
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
        <CTALink to={link} variant='primary' fullWidth={false}>
          View
        </CTALink>
      </CTAWrapper>
    </CardBody>
  </Card>
);

export { VaultCard };
export type { VaultCardProps };
