import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
type WalletConfig = {};

const defaultContext: WalletConfig = {} as WalletConfig;

const WalletContext = React.createContext(defaultContext);

const useWallet = (): WalletConfig => React.useContext(WalletContext);

const WalletProvider: React.FC<unknown> = ({ children }) => {
  return <WalletContext.Provider value={{}}>{children}</WalletContext.Provider>;
};

export { useWallet, WalletContext, WalletProvider };
