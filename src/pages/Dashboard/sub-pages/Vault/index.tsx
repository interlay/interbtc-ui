
import { useParams } from 'react-router-dom';

import VaultUI from 'containers/VaultUI';
import { URL_PARAMETERS } from 'utils/constants/links';

// ray test touch <<
const Vault = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [URL_PARAMETERS.VAULT_ID]: selectedVaultId } = useParams<Record<string, string>>();

  return (
    <VaultUI />
  );
};
// ray test touch >>

export default Vault;
