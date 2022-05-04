import { useGetVaults } from 'utils/hooks/api/use-get-vaults';

const useGetVaultStatus = ({ address }: { address: string; }): any => {
  const vaults = useGetVaults({ address });

  return vaults;
};

export { useGetVaultStatus };
