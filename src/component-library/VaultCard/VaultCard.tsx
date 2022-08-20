import { formatNumber } from '@/common/utils/utils';

import { CoinPair } from '../CoinPair';
import { CTALink } from '../CTA';
import { Tokens } from '../types';
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
  collateralSymbol: Tokens;
  wrappedSymbol: Tokens;
  pendingRequests: number;
  apy: string;
  collateralScore: string;
  link: string;
  atRisk: boolean;
}

const VaultCard = ({
  collateralSymbol,
  wrappedSymbol,
  pendingRequests,
  apy,
  collateralScore,
  link,
  atRisk
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
          <dd>{formatNumber(pendingRequests)}</dd>
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
