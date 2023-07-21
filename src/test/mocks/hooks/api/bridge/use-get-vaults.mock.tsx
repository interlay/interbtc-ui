import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import { MOCK_VAULTS } from '@/test/mocks/@interlay/interbtc-api';
import {
  BridgeVaultData,
  GetBridgeVaultData,
  GetVaultType,
  UseGetBridgeVaultResult
} from '@/utils/hooks/api/bridge/use-get-vaults';

const { VAULTS_AMOUNT, VAULTS_ID, VAULTS_TOKENS } = MOCK_VAULTS.DATA;

const mockRelayBridgeVaultData = (size: keyof typeof VAULTS_AMOUNT): BridgeVaultData => ({
  vaultId: VAULTS_ID.RELAY,
  amount: VAULTS_AMOUNT[size],
  collateralCurrency: RELAY_CHAIN_NATIVE_TOKEN,
  id: '1'
});

const mockGovernanceBridgeVaultData = (size: keyof typeof VAULTS_AMOUNT): BridgeVaultData => ({
  vaultId: VAULTS_ID.GOVERNANCE,
  amount: VAULTS_AMOUNT[size],
  collateralCurrency: GOVERNANCE_TOKEN,
  id: '2'
});

const mockIssueGetBridgeVaultData = (size: keyof typeof VAULTS_AMOUNT): GetBridgeVaultData<GetVaultType.ISSUE> => ({
  list: [mockRelayBridgeVaultData(size), mockGovernanceBridgeVaultData(size)],
  map: VAULTS_TOKENS[size],
  premium: undefined as never
});

const mockRedeemGetBridgeVaultData = (size: keyof typeof VAULTS_AMOUNT): GetBridgeVaultData<GetVaultType.REDEEM> => ({
  list: [mockRelayBridgeVaultData(size), mockGovernanceBridgeVaultData(size)],
  map: VAULTS_TOKENS[size],
  premium: {
    list: [mockRelayBridgeVaultData(size), mockGovernanceBridgeVaultData(size)],
    map: VAULTS_TOKENS[size]
  }
});

const mockUseGetIssueBridgeVaultResult = (
  size: keyof typeof VAULTS_AMOUNT
): UseGetBridgeVaultResult<GetVaultType.ISSUE> => ({
  data: mockIssueGetBridgeVaultData(size),
  getAvailableVaults: jest.fn().mockReturnValue([mockRelayBridgeVaultData(size), mockGovernanceBridgeVaultData(size)]),
  refetch: jest.fn()
});

export {
  mockGovernanceBridgeVaultData,
  mockIssueGetBridgeVaultData,
  mockRedeemGetBridgeVaultData,
  mockRelayBridgeVaultData,
  mockUseGetIssueBridgeVaultResult
};
