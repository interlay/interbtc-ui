import { CoinPair, CTALink, Tokens } from '@/component-library';

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CollateralScore,
  CTAWrapper,
  DlItem,
  StyledDl
} from './VaultCard.style';

interface VaultCardProps {
  collateralTokenTicker: string;
  wrappedSymbol: Tokens;
  pendingRequests: string;
  apy: string;
  collateralScore: string;
  link: string;
  atRisk: boolean;
}

const VaultCard = ({
  collateralTokenTicker,
  wrappedSymbol,
  pendingRequests,
  apy,
  collateralScore,
  link,
  atRisk
}: VaultCardProps): JSX.Element => (
  <Card>
    <CardHeader>
      <CoinPair coinOne={collateralTokenTicker as Tokens} coinTwo={wrappedSymbol} size='xl2' />
      <CardTitle>
        {collateralTokenTicker} - {wrappedSymbol}
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
          <dt>Current APR</dt>
          <dd>≈ {apy}</dd>
        </DlItem>
        <DlItem>
          <dt>Collateralization</dt>
          <CollateralScore $atRisk={atRisk}>{collateralScore}</CollateralScore>
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
