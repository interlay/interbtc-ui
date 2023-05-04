import { FixedPointNumber } from '@acala-network/sdk-core';
import { ApiProvider, BasicToken, Bridge, ChainName } from '@interlay/bridge/build';
import { BaseCrossChainAdapter } from '@interlay/bridge/build/base-chain-adapter';
import { atomicToBaseAmount, CurrencyExt, DefaultTransactionAPI, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ApiPromise } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import Big from 'big.js';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';
import { firstValueFrom } from 'rxjs';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { XCM_ADAPTERS } from '@/config/relay-chains';
import {
  CROSS_CHAIN_TRANSFER_AMOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_FROM_FIELD,
  CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_TO_FIELD,
  CROSS_CHAIN_TRANSFER_TOKEN_FIELD,
  CrossChainTransferFormData
} from '@/lib/form';
import { Chains } from '@/types/chains';
import { getExtrinsicStatus } from '@/utils/helpers/extrinsic';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { getXCMEndpoints } from './get-xcm-endpoints';

const XCMBridge = new Bridge({
  adapters: Object.values(XCM_ADAPTERS)
});

const XCMProvider = new ApiProvider();

type XCMBridgeData = {
  bridge: Bridge;
  provider: ApiProvider;
};

type UseXCMBridge = UseQueryResult<XCMBridgeData | undefined> & {
  originatingChains: Chains | undefined;
  getDestinationChains: (chain: ChainName) => Chains;
  getAvailableTokens: (from: ChainName, to: ChainName, originAddress: string, destinationAddress: string) => any;
  getInputConfigs: (
    from: ChainName,
    to: ChainName,
    token: string,
    destinationAddress: string,
    originAddress: string
  ) => any;
  getTransferableBalances: (
    from: ChainName,
    to: ChainName,
    originAddress: string,
    destinationAddress: string,
    tokens: string[]
  ) => any;
  sendTransaction: (formData: any) => any;
};

const initXCMBridge = async () => {
  const chains = Object.keys(XCM_ADAPTERS) as ChainName[];

  await firstValueFrom(XCMProvider.connectFromChain(chains, getXCMEndpoints(chains)));

  // Set Apis
  await Promise.all(chains.map((chain: ChainName) => XCMBridge.findAdapter(chain).setApi(XCMProvider.getApi(chain))));

  return { provider: XCMProvider, bridge: XCMBridge };
};

const useXCMBridge = (): UseXCMBridge => {
  const queryKey = ['available-xcm-channels'];

  const queryResult = useQuery({
    queryKey,
    queryFn: initXCMBridge
  });

  const { data, error } = queryResult;
  const prices = useGetPrices();

  const originatingChains = data?.bridge.adapters.map((adapter: BaseCrossChainAdapter) => {
    return {
      display: adapter.chain.display,
      id: adapter.chain.id
    };
  });

  const getDestinationChains = useCallback(
    (chain: ChainName): Chains => {
      return XCMBridge.router
        .getDestinationChains({ from: chain })
        .filter((destinationChain) =>
          originatingChains?.some((originatingChain) => originatingChain.id === destinationChain.id)
        );
    },
    [originatingChains]
  );

  const getAvailableTokens = useCallback(
    async (from: ChainName, to: ChainName, originAddress: string, destinationAddress: string) => {
      if (!data) return;

      const tokens = XCMBridge.router.getAvailableTokens({ from, to });

      const inputConfigs = await Promise.all(
        tokens.map(async (token) => {
          const inputConfig = await firstValueFrom(
            data.bridge.findAdapter(from).subscribeInputConfigs({
              to,
              token,
              address: destinationAddress,
              signer: originAddress
            })
          );

          // TODO: resolve type mismatch with BaseCrossChainAdapter and remove `any`
          const originAdapter = data.bridge.findAdapter(from) as any;

          const maxInputToBig = Big(inputConfig.maxInput.toString());
          const minInputToBig = Big(inputConfig.minInput.toString());

          // Never show less than zero
          const transferableBalance = inputConfig.maxInput < inputConfig.minInput ? 0 : maxInputToBig;
          const currency = XCMBridge.findAdapter(from).getToken(token, from);

          const nativeCurrency: BasicToken = {
            name: originAdapter.balanceAdapter.nativeToken,
            symbol: originAdapter.balanceAdapter.nativeToken,
            decimals: originAdapter.balanceAdapter.decimals,
            ed: originAdapter.balanceAdapter.ed
          };

          const amount = newMonetaryAmount(transferableBalance, (currency as unknown) as CurrencyExt, true);
          const balanceUSD = convertMonetaryAmountToValueInUSD(amount, getTokenPrice(prices, token)?.usd);
          const originFee = atomicToBaseAmount(inputConfig.estimateFee, (nativeCurrency as unknown) as CurrencyExt);

          return {
            balance: transferableBalance.toString(),
            balanceUSD: formatUSD(balanceUSD || 0, { compact: true }),
            destFee: `${inputConfig.destFee.balance.toNumber()} ${inputConfig.destFee.token}`,
            originFee: `${originFee.toString()} ${nativeCurrency.symbol}`,
            minTransferAmount: minInputToBig,
            value: token
          };
        })
      );

      return inputConfigs;
    },
    [data, prices]
  );

  const getInputConfigs = useCallback(
    async (from: ChainName, to: ChainName, token: string, destinationAddress: string, originAddress: string) =>
      await firstValueFrom(
        XCMBridge.findAdapter(from).subscribeInputConfigs({
          to,
          token,
          address: destinationAddress,
          signer: originAddress
        })
      ),
    []
  );

  const getTransferableBalances = useCallback(
    async (from: ChainName, to: ChainName, originAddress: string, destinationAddress: string, tokens: any[]) => {
      if (!data) return;

      const inputConfigs = await Promise.all(
        tokens.map(async (token) => {
          const inputConfig = await firstValueFrom(
            data.bridge.findAdapter(from).subscribeInputConfigs({
              to,
              token: token.ticker,
              address: destinationAddress,
              signer: originAddress
            })
          );

          return { ticker: token.ticker, inputConfig };
        })
      );

      return inputConfigs;
    },
    [data]
  );

  const sendTransaction = async (formData: CrossChainTransferFormData) => {
    console.log('formData', formData);

    if (!formData) return;

    const sendTransaction = async () => {
      const { signer } = await web3FromAddress(formData[CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD]!.toString());

      const adapter = XCMBridge.findAdapter(formData[CROSS_CHAIN_TRANSFER_FROM_FIELD] as any);

      const apiPromise = (XCMProvider.getApiPromise(
        formData[CROSS_CHAIN_TRANSFER_FROM_FIELD] as any
      ) as unknown) as ApiPromise;

      apiPromise.setSigner(signer);

      // TODO: Version mismatch with ApiPromise type. This should be inferred.
      adapter.setApi(apiPromise as any);

      const currency = XCMBridge.findAdapter(formData[CROSS_CHAIN_TRANSFER_FROM_FIELD] as any).getToken(
        formData[CROSS_CHAIN_TRANSFER_TOKEN_FIELD] as any,
        formData[CROSS_CHAIN_TRANSFER_FROM_FIELD] as any
      );

      const transferAmount = new MonetaryAmount(
        (currency as unknown) as CurrencyExt,
        formData[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD] as any
      );
      const transferAmountString = transferAmount.toString(true);
      const transferAmountDecimals = transferAmount.currency.decimals;

      // TODO: Transaction is in promise form
      const tx: any = adapter.createTx({
        amount: FixedPointNumber.fromInner(transferAmountString, transferAmountDecimals),
        to: formData[CROSS_CHAIN_TRANSFER_TO_FIELD],
        token: currency?.symbol,
        address: formData[CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD]
      } as any);

      console.log('tx', tx);

      const inBlockStatus = getExtrinsicStatus('InBlock');

      await DefaultTransactionAPI.sendLogged(
        apiPromise,
        formData[CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD] as any,
        tx,
        undefined,
        inBlockStatus
      );
    };

    await sendTransaction();
  };

  useErrorHandler(error);

  return {
    ...queryResult,
    originatingChains,
    getDestinationChains,
    getAvailableTokens,
    getInputConfigs,
    getTransferableBalances,
    sendTransaction
  };
};

export { useXCMBridge };
export type { UseXCMBridge };
