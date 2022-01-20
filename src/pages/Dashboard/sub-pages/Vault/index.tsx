
import { useParams } from 'react-router-dom';

import { URL_PARAMETERS } from 'utils/constants/links';

const Vault = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [URL_PARAMETERS.VAULT_ID]: selectedVaultId } = useParams<Record<string, string>>();

  return (
    <>Vault</>
  );
};

export default Vault;
