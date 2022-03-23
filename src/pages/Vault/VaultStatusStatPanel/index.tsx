
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { VaultExt } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';

import ErrorFallback from 'components/ErrorFallback';
import { COLLATERAL_TOKEN_ID_LITERAL } from 'utils/constants/currency';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

interface Props {
  vaultAccountId: AccountId;
}

const VaultStatusStatPanel = ({
  vaultAccountId
}: Props): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    data: vaultExt,
    error: vaultExtError
  } = useQuery<VaultExt<BitcoinUnit>, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'get',
      vaultAccountId,
      COLLATERAL_TOKEN_ID_LITERAL
    ],
    genericFetcher<VaultExt<BitcoinUnit>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(vaultExtError);
  // ray test touch <<
  console.log('[VaultStatusStatPanel] vaultExt => ', vaultExt);
  // ray test touch >>

  return (
    <>VaultStatusStatPanel</>
  );
};

export default withErrorBoundary(VaultStatusStatPanel, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
