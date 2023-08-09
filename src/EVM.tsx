import { MetaMaskInpageProvider } from '@metamask/providers';
import { evmToAddress } from '@polkadot/util-crypto';
import { ethers } from 'ethers';
import { FormEvent, useEffect, useState } from 'react';

import { CTA, Input } from '@/component-library';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { SS58_FORMAT } from '@/constants';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const convertEVMAddressToSubstrateHex = (evmAddress: string) => {
  return evmToAddress(evmAddress, SS58_FORMAT);
};

const useConnectEVM = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>();
  const [network, setNetwork] = useState<ethers.Network>();

  useEffect(() => {
    const connectToEVM = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        setProvider(provider);
        setSigner(signer);
        setNetwork(network);
      }
    };

    connectToEVM();
  }, []);

  return { provider, signer, network };
};

const EVM = (): JSX.Element => {
  const [address, setAddress] = useState<string>();
  const { signer, provider } = useConnectEVM();

  const connected = !!provider;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!signer) {
      alert('Signer not found - not possible to send INTR');
      return;
    }
    if (!address) {
      alert('Receiving address is empty - not possible to send INTR');
      return;
    }

    signer.sendTransaction({
      to: address,
      value: ethers.parseEther('1')
    });
  };

  return (
    <div>
      <h1>EVM POC</h1> <br />
      {connected ? `Connected with account ${signer?.address}` : 'EVM wallet not connected.'}
      <br />^ encoded in {GOVERNANCE_TOKEN.name} account format:{' '}
      {signer?.address ? convertEVMAddressToSubstrateHex(signer.address) : 'n/a'}
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        Receiving address (EVM):
        <Input onChange={(e) => setAddress(e.target.value)} />^ encoded in {GOVERNANCE_TOKEN.name} account format:{' '}
        {address ? convertEVMAddressToSubstrateHex(address) : 'n/a'}
        <br />
        <br />
        <CTA type='submit'>Send 1 {GOVERNANCE_TOKEN.ticker}</CTA>
      </form>
    </div>
  );
};

export { EVM };
