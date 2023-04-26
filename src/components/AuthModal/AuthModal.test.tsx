import * as substrate from '@/lib/substrate';
import { render, screen, userEvent, waitFor } from '@/test/test-utils';

import { AuthModal } from './AuthModal';
import {
  DEFAULT_ACCOUNTS,
  DEFAULT_ACCOUNT_1,
  DEFAULT_EXTENSIONS,
  DEFAULT_SUBWALLET_EXTENSION
} from '@/test/mocks/substrate/mocks';
import { SUBWALLET_WALLET, WALLETS } from '@/utils/constants/wallets';

describe('AuthModal', () => {
  it('should render with no wallets installed and navigate', async () => {
    jest.spyOn(substrate, 'useSubstrateSecureState').mockReturnValue({ extensions: [] } as any);
    jest.spyOn(window, 'open').mockImplementation(jest.fn());

    await render(<AuthModal isOpen onClose={jest.fn} />);

    expect(screen.getByRole('heading', { name: /please install supported wallet/i }));

    const items = screen.getAllByRole('button', { name: /navigate/i, exact: false });

    expect(items).toHaveLength(3);

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

    expect(screen.getByRole('heading', { name: /please select a wallet/i }));

    userEvent.click(
      screen.getByRole('button', { name: new RegExp(`select ${SUBWALLET_WALLET.title}`, 'i'), exact: false })
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /please select an account/i }));
    });

    userEvent.click(screen.getByRole('button', { name: new RegExp(DEFAULT_ACCOUNT_1.meta.name, 'i'), exact: false }));

    expect(handleAccountSelect).toHaveBeenCalledWith(DEFAULT_ACCOUNT_1);
    expect(handleAccountSelect).toHaveBeenCalledTimes(1);
  });
});
