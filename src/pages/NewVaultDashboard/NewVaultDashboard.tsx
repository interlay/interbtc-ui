import { withErrorBoundary } from 'react-error-boundary';

import { Dl } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import MainContainer from '@/parts/MainContainer';

import { VaultInsights } from './components';

const VaultDashboard = (): JSX.Element => {
  const headlineItems = [
    { term: 'Vault ID:', definition: '0xb7...40fab' },
    { term: 'Vault Status:', definition: 'Active' },
    { term: 'Current KSM exchange rate:  1 BTC = 152.33 KSM', definition: 'Active' },
    { term: 'Min Collateral Ratio:', definition: '120%' }
  ];

  return (
    <MainContainer>
      <Dl listItems={headlineItems} />
      <VaultInsights />
    </MainContainer>
  );
};

export default withErrorBoundary(VaultDashboard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
