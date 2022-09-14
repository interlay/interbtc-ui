const vaultsByAccountIdQuery = (accountId: string): string => `
{
    vaults(where: {accountId_eq: "${accountId}"}) {
      id
    }
  }
`;

export default vaultsByAccountIdQuery;
