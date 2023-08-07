import { FaucetClient } from '@interlay/interbtc-api';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { BITCOIN_NETWORK, FAUCET_URL } from '@/constants';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { useWallet } from '@/hooks/use-wallet';
import { BitcoinNetwork } from '@/types/bitcoin';

import { NotificationToastType, useNotifications } from '../context/Notifications';

type UseFaucetResult = {
  isAvailable: boolean;
  buttonProps: {
    pending: boolean;
    onClick: () => void;
  };
};

const useFaucet = (): UseFaucetResult => {
  const { t } = useTranslation();

  const wallet = useWallet();
  const notifications = useNotifications();
  const { getAvailableBalance } = useGetBalances();

  const faucetRef = useRef<FaucetClient>();

  const { mutate, isLoading } = useMutation<void, Error, string, unknown>({
    mutationFn: async (account: string) => {
      const faucet = faucetRef.current || new FaucetClient(window.bridge.api, FAUCET_URL);

      faucetRef.current = faucet;

      const receiverId = window.bridge.api.createType(ACCOUNT_ID_TYPE_NAME, account);
      await faucet.fundAccount(receiverId, GOVERNANCE_TOKEN);
    },
    onSuccess: () =>
      notifications.show('faucet', {
        type: NotificationToastType.STANDARD,
        props: { variant: 'success', title: t('notifications.funding_account_successful') }
      }),
    onError: () =>
      notifications.show('faucet', {
        type: NotificationToastType.STANDARD,
        props: { variant: 'error', title: t('notifications.funding_account_failed') }
      })
  });

  const isAvailable = useMemo(() => {
    if (isLoading) return true;

    const isTestnet = BITCOIN_NETWORK === BitcoinNetwork.Testnet;

    const hasGovernanceBalance = getAvailableBalance(GOVERNANCE_TOKEN.ticker)?.isZero();

    return !!wallet.account && isTestnet && !!FAUCET_URL && !!hasGovernanceBalance;
  }, [getAvailableBalance, isLoading, wallet.account]);

  const handleFundAccount = () => {
    if (!wallet.account || !isAvailable) return;

    mutate(wallet.account.toString());
  };

  return {
    isAvailable,
    buttonProps: {
      pending: isLoading,
      onClick: handleFundAccount
    }
  };
};

export { useFaucet };
export type { UseFaucetResult };
