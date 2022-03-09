const btcBlocksCountQuery = (where?: string): string => `
  {
    relayedBlocksConnection(orderBy: id_ASC, where: {${where ? `, ${where}` : ''}}) {
      totalCount
    }
  }
`;

export default btcBlocksCountQuery;
