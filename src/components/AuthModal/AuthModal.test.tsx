import { useState } from 'react';
import * as hooks from 'react-use';

import * as substrate from '@/lib/substrate';
import {
  DEFAULT_ACCOUNT_1,
  DEFAULT_ACCOUNT_2,
  DEFAULT_ACCOUNTS,
  DEFAULT_EXTENSIONS,
  DEFAULT_SELECTED_ACCOUNT_1
} from '@/test/mocks/substrate/mocks';
import { render, screen, userEvent, waitFor } from '@/test/test-utils';
import { POLKADOTJS_WALLET, SUBWALLET_WALLET, WALLETS } from '@/utils/constants/wallets';

import { AuthModal } from './AuthModal';

describe('AuthModal', () => {
  it('should render with no wallets installed and navigate', async () => {
    jest.spyOn(substrate, 'useSubstrateSecureState').mockReturnValue({ extensions: [] } as any);
    jest.spyOn(window, 'open').mockImplementation(jest.fn());

    await render(<AuthModal isOpen onClose={jest.fn} />);

    expect(screen.getByRole('heading', { name: /please install a supported wallet/i })).toBeInTheDocument();

    const items = screen.getAllByRole('button', { name: /navigate/i, exact: false });

    expect(items).toHaveLength(4);

    const [item] = items;

    userEvent.click(item);

    expect(window.open).toHaveBeenCalledWith(WALLETS[0].url, '_blank', 'noopener');
  });

  it('should render with wallet installed and select linked account', async () => {
    jest
      .spyOn(substrate, 'useSubstrateSecureState')
      .mockReturnValue({ extensions: DEFAULT_EXTENSIONS, accounts: DEFAULT_ACCOUNTS } as any);

    const handleAccountSelect = jest.fn();

    await render(<AuthModal isOpen onClose={jest.fn} onAccountSelect={handleAccountSelect} />);

    expect(screen.getByRole('heading', { name: /please select a wallet/i })).toBeInTheDocument();

    userEvent.click(
      screen.getByRole('button', { name: new RegExp(`select ${SUBWALLET_WALLET.title}`, 'i'), exact: false })
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /please select an account/i })).toBeInTheDocument();
      expect(screen.getAllByText(new RegExp(`${SUBWALLET_WALLET.title}`, 'i'))).toHaveLength(2);
    });

    userEvent.click(
      screen.getAllByRole('button', { name: new RegExp(DEFAULT_ACCOUNT_1.meta.name, 'i'), exact: false })[0]
    );

    expect(handleAccountSelect).toHaveBeenCalledWith(DEFAULT_ACCOUNT_1);
    expect(handleAccountSelect).toHaveBeenCalledTimes(1);
  });

  it('should be able to change wallet (wallet pre-selected)', async () => {
    jest.spyOn(substrate, 'useSubstrateSecureState').mockReturnValue({
      extensions: DEFAULT_EXTENSIONS,
      selectedAccount: DEFAULT_SELECTED_ACCOUNT_1,
      accounts: DEFAULT_ACCOUNTS
    } as any);

    await render(<AuthModal isOpen onClose={jest.fn} />);

    userEvent.click(screen.getByRole('button', { name: /change wallet/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /please select a wallet/i })).toBeInTheDocument();
    });

    userEvent.click(
      screen.getByRole('button', { name: new RegExp(`select ${POLKADOTJS_WALLET.title}`, 'i'), exact: false })
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /please select an account/i })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${POLKADOTJS_WALLET.title}`, 'i'))).toBeInTheDocument();
    });

    expect(
      screen.getAllByRole('button', { name: new RegExp(DEFAULT_ACCOUNT_2.meta.name, 'i'), exact: false })[0]
    ).toBeInTheDocument();
  });

  it('should be able to disconnect wallet (wallet pre-selected)', async () => {
    jest.spyOn(substrate, 'useSubstrateSecureState').mockReturnValue({
      extensions: DEFAULT_EXTENSIONS,
      selectedAccount: DEFAULT_SELECTED_ACCOUNT_1,
      accounts: DEFAULT_ACCOUNTS
    } as any);

    const handleDisconnect = jest.fn();

    await render(<AuthModal isOpen onClose={jest.fn} onDisconnect={handleDisconnect} />);

    userEvent.click(screen.getByRole('button', { name: /disconnect/i }));

    expect(handleDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should be able to copy address to clipboard', async () => {
    jest.spyOn(substrate, 'useSubstrateSecureState').mockReturnValue({
      extensions: DEFAULT_EXTENSIONS,
      selectedAccount: DEFAULT_SELECTED_ACCOUNT_1,
      accounts: DEFAULT_ACCOUNTS
    } as any);

    const handleCopy = jest.fn();

    jest.spyOn(hooks, 'useCopyToClipboard').mockReturnValue([{ value: '', noUserInteraction: false }, handleCopy]);

    await render(<AuthModal isOpen onClose={jest.fn} />);

    userEvent.click(
      screen.getByRole('button', { name: new RegExp(`copy ${DEFAULT_ACCOUNT_1.meta.name} address to clipboard`, 'i') })
    );

    expect(handleCopy).toHaveBeenCalledTimes(1);
    expect(handleCopy).toHaveBeenCalledWith(DEFAULT_SELECTED_ACCOUNT_1.address);
  });

  it('should mantain connected wallet as pre-select on each modal open', async () => {
    jest.spyOn(substrate, 'useSubstrateSecureState').mockReturnValue({
      extensions: DEFAULT_EXTENSIONS,
      selectedAccount: DEFAULT_SELECTED_ACCOUNT_1,
      accounts: DEFAULT_ACCOUNTS
    } as any);

    const Component = () => {
      const [isOpen, setOpen] = useState(true);

      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <AuthModal isOpen={isOpen} onClose={() => setOpen(false)} />
        </>
      );
    };

    await render(<Component />);

    expect(screen.getByRole('heading', { name: /please select an account/i })).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(`${SUBWALLET_WALLET.title}`, 'i'))).toHaveLength(2);

    userEvent.click(screen.getByRole('button', { name: /change wallet/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /please select a wallet/i })).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /dismiss/i }));

    userEvent.click(screen.getByRole('button', { name: /open/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /please select an account/i })).toBeInTheDocument();
      expect(screen.getAllByText(new RegExp(`${SUBWALLET_WALLET.title}`, 'i'))).toHaveLength(2);
    });

    userEvent.click(screen.getByRole('button', { name: /change wallet/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /please select a wallet/i })).toBeInTheDocument();
    });

    userEvent.click(
      screen.getByRole('button', { name: new RegExp(`select ${POLKADOTJS_WALLET.title}`, 'i'), exact: false })
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /please select an account/i })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${POLKADOTJS_WALLET.title}`, 'i'))).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('button', { name: /dismiss/i }));

    userEvent.click(screen.getByRole('button', { name: /open/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /please select an account/i })).toBeInTheDocument();
      expect(screen.getAllByText(new RegExp(`${SUBWALLET_WALLET.title}`, 'i'))).toHaveLength(2);
    });
  });
});
