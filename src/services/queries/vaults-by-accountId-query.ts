const vaultsByAccountIdQuery = (accountId: string): string => `
{
    vaults(where: {accountId_eq: "${accountId}"}, limit: 100) {
      id
    }
  }
`;

export default vaultsByAccountIdQuery;
