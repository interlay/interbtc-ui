const vaultsByAccountIdQuery = (accountId: string): string => `
{
    vaults(where: {accountId_eq: "${accountId}"}, limit: 1) {
      id
    }
  }
`;

export default vaultsByAccountIdQuery;
